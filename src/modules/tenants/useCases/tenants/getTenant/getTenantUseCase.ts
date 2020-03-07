import { UseCase } from '../../../../../shared/core/UseCase'
import { IGetTenantRequestDto } from './iGetTenantRequestDto'
import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { ITenantRepo } from '../../../repos/iTenantRepo'
import { Tenant } from '../../../domain/tenant'

type Response = Either<AppError.UnexpectedError, Result<Tenant[]>>

export class GetTenantUseCase implements UseCase<IGetTenantRequestDto, Promise<Response>> {
  private tenantRepo: ITenantRepo

  constructor(_tenantRepo: ITenantRepo) {
    this.tenantRepo = _tenantRepo
  }

  async execute(request?: IGetTenantRequestDto): Promise<Response> {
    try {
      const tenant = await this.tenantRepo.getAll()
      return right(Result.ok<Tenant[]>(tenant))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
