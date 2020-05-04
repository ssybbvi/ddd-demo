import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateAuthCodeUseCase } from './createAuthCodeUseCase'
import { CreateAuthCodeDto } from './createAuthCodeDto'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { AuthCode } from '../../../domain/authCode'
import { AuthCodeMap } from '../../../mappers/authCodeMapper'
import { IAuthCodeDto } from '../../../dtos/authCodeDto'
import { CreateAuthCodeErrors } from './createAuthCodeErrors'

export class CreateAuthCodeController extends BaseController {
  private useCase: CreateAuthCodeUseCase

  constructor(useCase: CreateAuthCodeUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const dto: CreateAuthCodeDto = {
      appId: req.query.appId,
      userId,
    }

    try {
      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }
      const authCode = resultValue.getValue() as AuthCode
      const authCodeDto = AuthCodeMap.toDTO(authCode)
      return this.ok<IAuthCodeDto>(res, authCodeDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
