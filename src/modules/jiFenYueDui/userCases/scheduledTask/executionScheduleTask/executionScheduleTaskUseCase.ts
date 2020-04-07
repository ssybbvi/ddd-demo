import { Result, Either, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ExecutionScheduleTaskDto } from './executionScheduleTaskDto'
import { IScheduledTaskRepo } from '../../../repos/scheduledTaskRepo'
import { WechatUtil } from '../../../../../shared/infra/wx/wxCommon'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class ExecutionScheduleTaskUseCase implements UseCase<ExecutionScheduleTaskDto, Promise<Response>> {
  private scheduledTaskRepo: IScheduledTaskRepo

  constructor(scheduledTaskRepo: IScheduledTaskRepo) {
    this.scheduledTaskRepo = scheduledTaskRepo
  }

  public async execute(request: ExecutionScheduleTaskDto): Promise<Response> {
    try {
      const {} = request

      const scheduledTaskList = await this.scheduledTaskRepo.filterByExecutable()

      for (let item of scheduledTaskList) {
        if (item.type === 'notificationWxSubscribe') {
          const { touser, template_id, page, data } = item.argument
          WechatUtil.messageSubscribeSend(touser, template_id, page, data).then(res => {
            item.updateTaskResult(JSON.stringify(res))
            this.scheduledTaskRepo.save(item)
          })
        } else {
          console.error(`该任务没有处理`, item)
        }
      }

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
