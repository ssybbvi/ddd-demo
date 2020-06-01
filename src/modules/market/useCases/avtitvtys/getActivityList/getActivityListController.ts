import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { IGetActivityListDto } from './getActivityListDto'
import { GetActivityListUseCase } from './getActivityListUseCase'
import { Activity } from '../../../domain/activity'
import { ActivityMap } from '../../../mappers/activityMap'

export class GetActivityListController extends BaseController {
  private useCase: GetActivityListUseCase

  constructor(useCase: GetActivityListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const dto = req.body as IGetActivityListDto

      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const activityList = resultValue.getValue() as Activity[]
      const activityDtoList = await ActivityMap.toListDto(activityList)
      return this.ok(res, activityDtoList)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
