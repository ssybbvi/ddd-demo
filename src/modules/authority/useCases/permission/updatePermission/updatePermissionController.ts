import * as express from 'express'
import { UpdatePermissionUseCase } from './updatePermissionUseCase'
import { UpdatePermissionRequestDto } from './updatePermissionRequestDto'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { UpdatePermissionErrors } from './updatePermissionError'

export class UpdatePermissionController extends BaseController {
  private updatePermission: UpdatePermissionUseCase

  constructor(useCase: UpdatePermissionUseCase) {
    super()
    this.updatePermission = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: UpdatePermissionRequestDto = req.body as UpdatePermissionRequestDto

    try {
      const result = await this.updatePermission.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case UpdatePermissionErrors.PermissionExistSameNameError:
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
