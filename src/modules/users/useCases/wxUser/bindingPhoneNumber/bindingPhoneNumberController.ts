import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { BindingPhoneNumberUseCase } from './bindingPhoneNumberUseCase'
import { BindingPhoneNumberDto } from './bindingPhoneNumberDto'
import { DecodedExpressRequest } from '../../../infra/http/models/decodedRequest'

export class BindingPhoneNumberController extends BaseController {
  private useCase: BindingPhoneNumberUseCase

  constructor(useCase: BindingPhoneNumberUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { iv, encryptedData } = req.body as BindingPhoneNumberDto
    const { userId } = req.decoded
    const dto: BindingPhoneNumberDto = { iv, encryptedData, userId }

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
