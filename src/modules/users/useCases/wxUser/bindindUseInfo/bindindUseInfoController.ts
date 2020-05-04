import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../infra/http/models/decodedRequest'
import { BindindUseInfoUseCase } from './bindindUseInfoUseCase'
import { BindindUseInfoDto } from './bindindUseInfoDto'

export class BindindUseInfoController extends BaseController {
  private useCase: BindindUseInfoUseCase

  constructor(useCase: BindindUseInfoUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { nickName, avatarUrl, gender } = req.body as BindindUseInfoDto
    const { userId } = req.decoded
    const dto: BindindUseInfoDto = { nickName, avatarUrl, gender, userId }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        return this.ok<void>(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
