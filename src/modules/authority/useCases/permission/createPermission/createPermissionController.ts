import * as express from 'express'
import { CreatePermissionUseCase } from './createPermissionUseCase'
import { CreatePermissionRequestDto } from './createPermissionRequestDto'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { CreatePermissionErrors } from './createPermissionError'

export class CreatePermissionController extends BaseController {
  private createPermission: CreatePermissionUseCase

  constructor(useCase: CreatePermissionUseCase) {
    super()
    this.createPermission = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CreatePermissionRequestDto = req.body as CreatePermissionRequestDto

    try {
      const result = await this.createPermission.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreatePermissionErrors.PermissionExistSameNameError:
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
