import { IMapper } from '../../../shared/infra/Mapper'
import { Tenant } from '../domain/tenant'
import { ITenantDTO } from '../dtos/tenantDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { TenantName } from '../domain/tenantName'
import { TenantConnectionString } from '../domain/tenantConnectionString'
import { ITenantDbModels } from '../dbModels/iTenantDbModels'

export class TenantMap implements IMapper<Tenant> {
  public static toDTO(tenant: Tenant): ITenantDTO {
    return {
      name: tenant.name.value,
      connectionString: tenant.connectionString.value,
      isActive: tenant.isActive
    }
  }

  public static toDomain(raw: any): Tenant {
    const tenantNameOrError = TenantName.create({ tenantName: raw.name })
    const connectionStringOrError = TenantConnectionString.create({ connectionString: raw.connectionString })

    const tenantOrError = Tenant.create(
      {
        name: tenantNameOrError.getValue(),
        connectionString: connectionStringOrError.getValue(),
        isActive: raw.isActive
      },
      new UniqueEntityID(raw._id)
    )

    tenantOrError.isFailure ? console.log(tenantOrError.error) : ''

    return tenantOrError.isSuccess ? tenantOrError.getValue() : null
  }

  public static async toPersistence(tenant: Tenant): Promise<ITenantDbModels> {
    return {
      _id: tenant.tenantId.id.toString(),
      name: tenant.name.value,
      connectionString: tenant.connectionString.value,
      isActive: tenant.isActive
    }
  }
}
