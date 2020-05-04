import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetTokenUseCase } from './getTokenUseCase'
import { ThirdPartyApp } from '../../../domain/thirdPartyApp'
import { ThirdPartyAppMap } from '../../../mappers/thirdPartyAppMapper'
import { IThirdPartyAppByTokenDto } from '../../../dtos/thirdPartyAppDto'
import { GetTokenDto } from './getTokenDto'

export class GetTokenController extends BaseController {
  private useCase: GetTokenUseCase

  constructor(useCase: GetTokenUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { appId, secret, grantType } = req.query

    const dto: GetTokenDto = {
      appId,
      secret,
      grantType,
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const appUser = result.value.getValue() as ThirdPartyApp
      const appUserDto = ThirdPartyAppMap.toDTOByGetToken(appUser)
      return this.ok<IThirdPartyAppByTokenDto>(res, appUserDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
