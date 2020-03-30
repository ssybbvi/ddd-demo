import { BaseController } from "../../../../shared/infra/http/models/BaseController"
import * as express from 'express'
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest"
import { DayDayTaskDto } from "../../dtos/dayDayTaskDto"
import { DayDayTask } from "../../domain/dayDayTask"
import { DayDayTaskMap } from "../../mappers/dayDayTaskMap"
import { CompleteTaskUseCase } from "./completeTaskUseCase"
import { CompleteTaskDto } from "./completeTaskDto"

export class CompleteTaskController extends BaseController {
  private useCase: CompleteTaskUseCase

  constructor(useCase: CompleteTaskUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const { type } = req.body
    const dto: CompleteTaskDto = { userId, type }

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
        return this.ok<void>(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
