import * as express from 'express'
import { DeleteRoleUseCase } from './deleteRoleUseCase'
import { DeleteRoleRequestDto } from './deleteRoleRequestDto'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { DeleteRoleErrors } from './deleteRoleErrors'

export class DeleteRoleController extends BaseController {
  private deleteRole: DeleteRoleUseCase

  constructor(useCase: DeleteRoleUseCase) {
    super()
    this.deleteRole = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: DeleteRoleRequestDto = req.body as DeleteRoleRequestDto

    try {
      const result = await this.deleteRole.execute(dto)

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
