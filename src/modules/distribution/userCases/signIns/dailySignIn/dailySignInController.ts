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
      memberId: userId
    }

    try {
      const result = await this.useCase.execute(dto)
      let dailySignInUseCaseValue = result.value
      if (result.isLeft()) {
        const error = dailySignInUseCaseValue

        switch (error.constructor) {
          case DailySignInErrors.TodayAlreadySignInError:
            return this.notFound(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        const dailySignInDtoResult: DailySignInDtoResult = dailySignInUseCaseValue.getValue() as DailySignInDtoResult
        return this.ok<DailySignInDtoResult>(res, dailySignInDtoResult)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
