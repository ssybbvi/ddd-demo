import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DailySignInUseCase } from './dailySignInUseCase'
import { DailySignInDto } from './dailySignInDto'
import { DailySignInErrors } from './dailySignInErrors'
import { DailySignInDtoResult } from './dailySignInDtoResult'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'

export class DailySignInController extends BaseController {
  private useCase: DailySignInUseCase

  constructor(useCase: DailySignInUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: DailySignInDto = {
      userId: userId,
    }

    try {
      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const dailySignInDtoResult: DailySignInDtoResult = resultValue.getValue() as DailySignInDtoResult
        return this.ok<DailySignInDtoResult>(res, dailySignInDtoResult)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
