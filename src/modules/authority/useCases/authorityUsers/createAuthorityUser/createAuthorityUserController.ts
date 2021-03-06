import * as express from 'express'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { CreateAuthorityUserUseCase } from './createAuthorityUserUseCase'
import { CreatePermissionErrors } from '../../permission/createPermission/createPermissionError'
import { CreateAuthorityUserDTO } from './createAuthorityUserDTO'

export class CreateAuthorityUserController extends BaseController {
  private createAuthorityUserUseCase: CreateAuthorityUserUseCase

  constructor(useCase: CreateAuthorityUserUseCase) {
    super()
    this.createAuthorityUserUseCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CreateAuthorityUserDTO = req.body as CreateAuthorityUserDTO

    try {
      const result = await this.createAuthorityUserUseCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
