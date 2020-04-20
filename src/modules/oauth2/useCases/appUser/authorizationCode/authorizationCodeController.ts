import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { AuthorizationCodeDto } from './authorizationCodeDto'
import { AuthorizationCodeUseCase } from './authorizationCodeUseCase'
import { AppUser } from '../../../domain/appUser'
import { AppUserMap } from '../../../mappers/appUserMapper'
import { IAppUserDto } from '../../../dtos/appUserDto'



export class AuthorizationCodeController extends BaseController {
  private useCase: AuthorizationCodeUseCase

  constructor(useCase: AuthorizationCodeUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { appId, secret, code, grantType } = req.query

    const dto: AuthorizationCodeDto = {
      appId, secret, code, grantType
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue().message)
        }
      }

      const appUser = result.value.getValue() as AppUser
      const appUserDto = AppUserMap.toDTO(appUser)
      return this.ok<IAppUserDto>(res, appUserDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
