import * as express from 'express'
import { CreateRoleUseCase } from './createRoleUseCase'
import { CreateRoleRequestDto } from './createRoleRequestDto'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { CreateRoleErrors } from './cerateRoleErrors'

export class CreateRoleController extends BaseController {
  private createRole: CreateRoleUseCase

  constructor(useCase: CreateRoleUseCase) {
    super()
    this.createRole = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CreateRoleRequestDto = req.body as CreateRoleRequestDto

    try {
      const result = await this.createRole.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreateRoleErrors.RoleExistSameNameError:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue())
        }
      } else {
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
