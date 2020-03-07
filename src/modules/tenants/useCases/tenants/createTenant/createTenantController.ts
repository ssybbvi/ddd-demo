import * as express from 'express'
import { CreateTenantUseCase } from './createTenantUseCase'
import { CreateTenantRequestDto } from './createTenantRequestDto'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { CreateTenantErrors } from './createTenantErrors'

export class CreateTenantController extends BaseController {
  private createTenant: CreateTenantUseCase

  constructor(useCase: CreateTenantUseCase) {
    super()
    this.createTenant = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CreateTenantRequestDto = req.body as CreateTenantRequestDto

    try {
      const result = await this.createTenant.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case CreateTenantErrors.TenantExistSameNameError:
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
