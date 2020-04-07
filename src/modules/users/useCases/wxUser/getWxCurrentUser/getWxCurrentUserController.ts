import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { DecodedExpressRequest } from '../../../infra/http/models/decodedRequest'
import { GetWxCurrentUserUseCase } from './getWxCurrentUserUseCase'
import { UserMap } from '../../../mappers/userMap'
import * as express from 'express'
import { WxUserMap } from '../../../mappers/wxUserMap'

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
        const wxuser = result.value.getValue()
        return this.ok(res, {
          user: WxUserMap.toDTO(wxuser)
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
