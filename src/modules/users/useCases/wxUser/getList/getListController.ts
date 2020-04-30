import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { DecodedExpressRequest } from '../../../infra/http/models/decodedRequest'
import * as express from 'express'
import { WxUserMap } from '../../../mappers/wxUserMap'
import { GetListUseCase } from './getListUseCase'

export class GetListController extends BaseController {
  private useCase: GetListUseCase

  constructor(useCase: GetListUseCase) {
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
        const wxuserList = result.value.getValue()
        const wxUserDtoList = await WxUserMap.toListDto(wxuserList)
        return this.ok(res, { wxUser: wxUserDtoList })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
