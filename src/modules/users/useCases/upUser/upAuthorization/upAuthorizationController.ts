import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { LoginDTOResponse } from '../../user/login/LoginDTO'
import { UpAuthorizationUseCase } from './upAuthorizationUseCase'
import { UpAuthorizationDto } from './upAuthorizationDto'
import { UpAuthorizationErrors } from './upAuthorizationErrors'

export class UpAuthorizationController extends BaseController {
  private useCase: UpAuthorizationUseCase

  constructor(useCase: UpAuthorizationUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpAuthorizationDto = req.body as UpAuthorizationDto

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case UpAuthorizationErrors.PasswordDoesntMatchError:
            return this.fail(res, error.errorValue().message)
          case UpAuthorizationErrors.UserNameDoesntExistError:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        const wxAuthorizationDtoResult: LoginDTOResponse = result.value.getValue() as LoginDTOResponse
        return this.ok<LoginDTOResponse>(res, wxAuthorizationDtoResult)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
