import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import { DecodedExpressRequest } from '../../infra/http/models/decodedRequest'
import { GetWxCurrentUserUseCase } from '../getWxCurrentUser/getWxCurrentUserUseCase'
import { UserMap } from '../../mappers/userMap'
import * as express from 'express'

export class GetWxCurrentUserController extends BaseController {
  private useCase: GetWxCurrentUserUseCase

  constructor(useCase: GetWxCurrentUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    try {
      const result = await this.useCase.execute({ userId })

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message)
      } else {
        const user = result.value.getValue()
        return this.ok(res, {
          user: null //UserMap.toWxLoginMe(user)
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
