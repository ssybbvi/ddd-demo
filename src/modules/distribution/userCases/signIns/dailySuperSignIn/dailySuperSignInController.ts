import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { SignInDTO } from '../../../dtos/signInDTO'
import { SignInMap } from '../../../mappers/signInMap'
import { SignIn } from '../../../domain/signIn'
import { DailySuperSignInUseCase } from './dailySuperSignInUseCase'
import { DailySuperSignInDto } from './dailySuperSignInDto'
import { DailySuperSignInDtoResult } from './dailySuperSignInDtoResult'
import { DailySuperSignInErrors } from './dailySuperSignInErrors'

export class DailySuperSignInController extends BaseController {
  private useCase: DailySuperSignInUseCase

  constructor(useCase: DailySuperSignInUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: DailySuperSignInDto = {
      memberId: userId
    }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          case DailySuperSignInErrors.NonCompliantErrors:
            return this.notFound(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        return this.ok<DailySuperSignInDtoResult>(res, useCaseValue.getValue())
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
