import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetRecentSignInUseCase } from './getRecentSignInUseCase'
import { GetRecentSignInDto } from './getRecentSignInDto'
import { GetRecentSignInDtoResult } from './getRecentSignInDtoResult'

export class GetRecentSignInController extends BaseController {
  private useCase: GetRecentSignInUseCase

  constructor(useCase: GetRecentSignInUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: GetRecentSignInDto = {
      userId: userId,
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        return this.ok<GetRecentSignInDtoResult>(res, result.value.getValue())
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
