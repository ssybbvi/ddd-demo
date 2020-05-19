import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateAddressUserUseCase } from './createAddressUserUseCase'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { ICreateAddressUserDto } from './createAddressUserDto'

export class CreateAddressUserController extends BaseController {
  private useCase: CreateAddressUserUseCase

  constructor(useCase: CreateAddressUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const dto: ICreateAddressUserDto = req.body as ICreateAddressUserDto
    dto.userId = userId

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
