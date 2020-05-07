import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { ITenantRepo } from '../../../repos/iTenantRepo'
import { Tenant } from '../../../domain/tenant'
import { GetTenantTokenDto } from './getTenantTokenDto'
import { IAuthService } from '../../../../../shared/infra/auth/authService'
import { JWTToken } from '../../../../users/domain/jwt'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'
import { GetTenantTokenDtoResponse } from './getTenantTokenDtoResponse'

type Response = Either<AppError.UnexpectedError, Result<GetTenantTokenDtoResponse>>

export class GetTenantTokenUseCase implements UseCase<GetTenantTokenDto, Promise<Response>> {
  private tenantRepo: ITenantRepo
  private authService: IAuthService

  constructor(_tenantRepo: ITenantRepo, authService: IAuthService) {
    this.tenantRepo = _tenantRepo
    this.authService = authService
  }

  async execute(request: GetTenantTokenDto): Promise<Response> {
    try {
      const { tenantId } = request
      const tenant = await this.tenantRepo.getById(tenantId)
      if (!tenant) {
        return left(new NotFoundError(`找不到该tenantId:${tenantId}`))
      }
      const accessToken: JWTToken = this.authService.signJWT({
        tenantId
      })

      return right(Result.ok<GetTenantTokenDtoResponse>({
        tenantAccessToken: accessToken
      }))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
