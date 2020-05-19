import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { UpdateAddressUserUseCase } from './updateAddressUserUseCase'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { IUpdateAddressUserDto } from './updateAddressUserDto'

export class UpdateAddressUserController extends BaseController {
  private useCase: UpdateAddressUserUseCase

  constructor(useCase: UpdateAddressUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: IUpdateAddressUserDto = req.body as IUpdateAddressUserDto
    console.log('======', dto)
    try {
      const result = await this.useCase.execute(dto)
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
