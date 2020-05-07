import { IMapper } from '../../../shared/infra/Mapper'
import { Tenant } from '../domain/tenant'
import { ITenantDTO } from '../dtos/tenantDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { TenantName } from '../domain/tenantName'
import { ITenantDbModels, IMongodbConnectionDbModel } from '../dbModels/iTenantDbModels'
import { TenantMongodbConnection } from '../domain/tenantMongodbConnection'

export class TenantMap implements IMapper<Tenant> {
  public static toDTO(tenant: Tenant): ITenantDTO {
    return {
      name: tenant.name.value,
      mongodbConnection: tenant.mongodbConnection,
      isActive: tenant.isActive,
    }
  }

  public static toDomain(raw: ITenantDbModels): Tenant {
    if (!raw) {
      return null
    }
    const tenantNameOrError = TenantName.create({ tenantName: raw.name })
    const connectionStringOrError = TenantMongodbConnection.create({
      url: raw.mongodbConnection.url,
      dbName: raw.mongodbConnection.dbName,
    })

    const tenantOrError = Tenant.create(
      {
        name: tenantNameOrError.getValue(),
        mongodbConnection: connectionStringOrError.getValue(),
        isActive: raw.isActive,
      },
      new UniqueEntityID(raw._id)
    )

    tenantOrError.isFailure ? console.log(tenantOrError.error) : ''

    return tenantOrError.isSuccess ? tenantOrError.getValue() : null
  }

  public static async toPersistence(tenant: Tenant): Promise<ITenantDbModels> {

    const mongodbConnectionDbModel: IMongodbConnectionDbModel = {
      url: tenant.mongodbConnection.url,
      dbName: tenant.mongodbConnection.dbName
    }
    return {
      _id: tenant.tenantId.id.toString(),
      name: tenant.name.value,
      mongodbConnection: mongodbConnectionDbModel,
      isActive: tenant.isActive,
    }
  }
}
