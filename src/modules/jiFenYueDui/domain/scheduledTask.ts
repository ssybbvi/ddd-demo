import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { ScheduledTaskType } from './scheduledTaskType'

export interface NotificationWxSubscribe {
  touser: string
  template_id: string
  page: string
  data: any
}

interface IScheduledTasksProps {
  argument: NotificationWxSubscribe
  userId: string
  type: ScheduledTaskType
  executionTime: number
  isExecuted?: boolean
  createAt?: number
  isSuccess?: boolean
  result?: string
  relationId: string
}

export class ScheduledTask extends AggregateRoot<IScheduledTasksProps> {
  private constructor(props: IScheduledTasksProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get argument(): NotificationWxSubscribe {
    return this.props.argument
  }

  get userId(): string {
    return this.props.userId
  }

  get type(): ScheduledTaskType {
    return this.props.type
  }

  get executionTime(): number {
    return this.props.executionTime
  }

  get isExecuted(): boolean {
    return this.props.isExecuted
  }

  get createAt(): number {
    return this.props.createAt
  }

  get isSuccess(): boolean {
    return this.props.isSuccess
  }

  get result(): string {
    return this.props.result
  }

  get relationId(): string {
    return this.props.relationId
  }

  public updateTaskResult(result: string, isSuccess?: boolean) {
    this.props.isExecuted = true
    this.props.isSuccess = isSuccess
    this.props.result = result
  }

  public static create(props: IScheduledTasksProps, id?: UniqueEntityID): Result<ScheduledTask> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.argument, argumentName: '任务参数' },
      { argument: props.userId, argumentName: '用户编号' },
      { argument: props.type, argumentName: '任务类型' },
      { argument: props.executionTime, argumentName: '执行时间' },
      { argument: props.relationId, argumentName: '关联Id' }
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<ScheduledTask>(guardResult.message)
    }

    const defaultValues: IScheduledTasksProps = {
      ...props,
      createAt: props.createAt ? props.createAt : Date.now(),
      isExecuted: props.isExecuted ? props.isExecuted : false
    }

    const scheduledTask = new ScheduledTask(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
      //fund.addDomainEvent(new CommodityCreated(fund))
    }
    return Result.ok<ScheduledTask>(scheduledTask)
  }
}
