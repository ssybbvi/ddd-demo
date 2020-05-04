import * as express from 'express'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { IGetTenantRequestDto } from './iGetTenantRequestDto'
import { GetTenantUseCase } from './getTenantUseCase'
import { IGetTenantResponseDto } from './iGetTenantResponseDto'
import { TenantMap } from '../../../mappers/tenantMap'

export class GetTenantController extends BaseController {
  private useCase: GetTenantUseCase

  constructor(useCase: GetTenantUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute()

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const list = result.value.getValue()
      return this.ok<IGetTenantResponseDto>(res, {
        tenants: list.map((d) => TenantMap.toDTO(d)),
      })
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
