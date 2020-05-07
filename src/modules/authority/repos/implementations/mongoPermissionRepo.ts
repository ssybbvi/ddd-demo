import { IPermissionRepo } from '../permissionRepo'
import { Permission } from '../../domain/permission'
import { IPermissionDbModel } from '../../dbModels/iPermissionDbModel'
import { PermissionMap } from '../../mappers/permissionMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoPermissionRepo implements IPermissionRepo {
  private getCollection(): MongodbWithTenantCollection<IPermissionDbModel> {
    return MongodbWithTenant.instance.Collection<IPermissionDbModel>('permission')
  }

  public async filter(): Promise<Permission[]> {
    let list = await this.getCollection()
      .find({})
      .toArray()
    return list.map(item => PermissionMap.toDomain(item))
  }

  public async findByName(name: string): Promise<Permission[]> {
    let list = await this.getCollection()
      .find({ name })
      .toArray()
    return list.map(item => PermissionMap.toDomain(item))
  }

  public async save(permission: Permission): Promise<void> {
    const permissionPersistence = await PermissionMap.toPersistence(permission)
    await this.getCollection().updateOne(
      { _id: permissionPersistence._id },
      {
        $set: {
          name: permissionPersistence.name,
          discriminator: permissionPersistence.discriminator
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(permission)
  }

  public async deleteById(_id: string): Promise<void> {
  }

  public async getById(_id: string): Promise<Permission> {
    let permission = await this.getCollection().findOne({ _id })
    return PermissionMap.toDomain(permission)
  }
}
