import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateWxUserUseCase } from './createWxUserUseCase'
import { CreateWxUserDto } from './createWxUserDto'
import { CreateWxUserErrors } from './createWxUserErrors'

export class CreateWxUserController extends BaseController {
  private useCase: CreateWxUserUseCase

  constructor(useCase: CreateWxUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateWxUserDto = req.body as CreateWxUserDto

    try {
      const result = await this.useCase.execute(dto)
      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreateWxUserErrors.WxJsCodeToSessionError:
            return this.fail(res, error.errorValue().message)
          case CreateWxUserErrors.OpenIdAlreadyExist:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue())
        }
      } else {
        return this.ok<void>(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
