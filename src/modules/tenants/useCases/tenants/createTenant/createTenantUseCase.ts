import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { CreateTenantRequestDto } from './createTenantRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ITenantRepo } from '../../../repos/iTenantRepo'
import { CreateTenantErrors } from './createTenantErrors'
import { AppError } from '../../../../../shared/core/AppError'
import { Tenant } from '../../../domain/tenant'
import { TenantName } from '../../../domain/tenantName'
import { TenantConnectionString } from '../../../domain/tenantConnectionString'

type Response = Either<
  CreateTenantErrors.TenantExistSameNameError | Result<Tenant> | Result<void> | AppError.UnexpectedError,
  Result<void>
>

export class CreateTenantUseCase implements UseCase<CreateTenantRequestDto, Promise<Response>> {
  private tenantRepo: ITenantRepo

  constructor(_tenantRepo: ITenantRepo) {
    this.tenantRepo = _tenantRepo
  }

  async execute(request?: CreateTenantRequestDto): Promise<Response> {
    const tenantNameOrError = TenantName.create({ tenantName: request.name })
    const tenantConnectionStringOrError = TenantConnectionString.create({ connectionString: request.connectionString })

    const dtoResult = Result.combine([tenantNameOrError, tenantConnectionStringOrError])

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response
    }

    let isExistsSameName = await this.tenantRepo.existsSameName(request.name)
    if (isExistsSameName) {
      return left(new CreateTenantErrors.TenantExistSameNameError(request.name))
    }

    const tenantOrError: Result<Tenant> = Tenant.create({
      name: tenantNameOrError.getValue(),
      connectionString: tenantConnectionStringOrError.getValue(),
      isActive: request.isActive,
    })

    if (tenantOrError.isFailure) {
      return left(Result.fail<Tenant>(tenantOrError.error.toString())) as Response
    }

    const tenant: Tenant = tenantOrError.getValue()
    await this.tenantRepo.create(tenant)

    return right(Result.ok<void>())
  }
}
