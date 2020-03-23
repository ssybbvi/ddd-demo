import * as express from 'express'
import { UpdateRoleUseCase } from './updateRoleUseCase'
import { UpdateRoleRequestDto } from './updateRoleRequestDto'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { UpdateRoleErrors } from './updateRoleErrors'

export class UpdateRoleController extends BaseController {
  private updateRole: UpdateRoleUseCase

  constructor(useCase: UpdateRoleUseCase) {
    super()
    this.updateRole = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: UpdateRoleRequestDto = req.body as UpdateRoleRequestDto

    try {
      const result = await this.updateRole.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case UpdateRoleErrors.RoleExistSameNameError:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        return this.ok(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
