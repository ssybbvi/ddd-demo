import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { WxAuthorizationUseCase } from './wxAuthorizationUseCase'
import { WxAuthorizationDto } from './wxAuthorizationDto'
import { WxAuthorizationErrors } from './wxAuthorizationErrors'
import { LoginDTOResponse } from '../../user/login/LoginDTO'

export class WxAuthorizationController extends BaseController {
  private useCase: WxAuthorizationUseCase

  constructor(useCase: WxAuthorizationUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: WxAuthorizationDto = req.body as WxAuthorizationDto

    try {
      const result = await this.useCase.execute(dto)
      let wxAuthorizationUseCaseValue = result.value
      if (result.isLeft()) {
        const error = wxAuthorizationUseCaseValue

        switch (error.constructor) {
          case WxAuthorizationErrors.WxJsCodeToSessionError:
            return this.notFound(res, error.errorValue().message)
          case WxAuthorizationErrors.InviteTokenInValidError:
            return this.notFound(res, error.errorValue().message)
          case WxAuthorizationErrors.LoginForbidInviteTokenError:
            return this.notFound(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        const wxAuthorizationDtoResult: LoginDTOResponse = wxAuthorizationUseCaseValue.getValue() as LoginDTOResponse
        return this.ok<LoginDTOResponse>(res, wxAuthorizationDtoResult)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}