import { GetDayDayTaskListUseCase } from "./getDayDayTaskListUseCase"
import { BaseController } from "../../../../shared/infra/http/models/BaseController"
import * as express from 'express'
import { GetDayDayTaskDto } from "./getDayDayTaskListDto"
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest"
import { DayDayTaskDto } from "../../dtos/dayDayTaskDto"
import { DayDayTask } from "../../domain/dayDayTask"
import { DayDayTaskMap } from "../../mappers/dayDayTaskMap"

export class GetDayDayTaskListController extends BaseController {
  private useCase: GetDayDayTaskListUseCase

  constructor(useCase: GetDayDayTaskListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const dto: GetDayDayTaskDto = { userId }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        const dayDayTaskList = useCaseValue.getValue() as DayDayTask[]
        const dayDayTaskDtoList = dayDayTaskList.map(item => DayDayTaskMap.toDTO(item))
        return this.ok<DayDayTaskDto[]>(res, dayDayTaskDtoList)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
