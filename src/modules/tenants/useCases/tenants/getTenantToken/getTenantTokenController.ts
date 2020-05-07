import * as express from 'express'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { TenantMap } from '../../../mappers/tenantMap'
import { GetTenantTokenUseCase } from './getTenantTokenUseCase'
import { GetTenantTokenDtoResponse } from './getTenantTokenDtoResponse'

export class GetTenantTokenController extends BaseController {
  private useCase: GetTenantTokenUseCase

  constructor(useCase: GetTenantTokenUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const { tenantId } = req.body

      const result = await this.useCase.execute({ tenantId })

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const getTenantTokenDtoResponse: GetTenantTokenDtoResponse = result.value.getValue()
      return this.ok<GetTenantTokenDtoResponse>(res, getTenantTokenDtoResponse)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
