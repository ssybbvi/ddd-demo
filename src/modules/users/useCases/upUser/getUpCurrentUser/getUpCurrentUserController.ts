import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { DecodedExpressRequest } from '../../../infra/http/models/decodedRequest'
import * as express from 'express'
import { UpUserMap } from '../../../mappers/upUserMap'
import { GetUpCurrentUserUseCase } from './getUpCurrentUserUseCase'

export class GetUpCurrentUserController extends BaseController {
  private useCase: GetUpCurrentUserUseCase

  constructor(useCase: GetUpCurrentUserUseCase) {
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
        const upUser = result.value.getValue()
        return this.ok(res, {
          user: UpUserMap.toAdminDto(upUser)
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
