import * as express from 'express'
import { DeletePermissionUseCase } from './deletePermissionUseCase'
import { DeletePermissionRequestDto } from './deletePermissionRequestDto'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { DeletePermissionErrors } from './deletePermissionErrors'

export class DeletePermissionController extends BaseController {
  private deletePermission: DeletePermissionUseCase

  constructor(useCase: DeletePermissionUseCase) {
    super()
    this.deletePermission = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: DeletePermissionRequestDto = req.body as DeletePermissionRequestDto

    try {
      const result = await this.deletePermission.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case DeletePermissionErrors.PermissionIdIsNullError:
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
