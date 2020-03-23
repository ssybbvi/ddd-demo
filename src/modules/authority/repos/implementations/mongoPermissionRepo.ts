import { IPermissionRepo } from '../permissionRepo'
import { Permission } from '../../domain/permission'
import { Global } from '../../../../shared/infra/database/mongodb'
import { Collection } from 'mongodb'
import { IPermissionDbModel } from '../../dbModels/iPermissionDbModel'
import { PermissionMap } from '../../mappers/permissionMap'

export class MongoPermissionRepo implements IPermissionRepo {
  private createCollection(): Collection<IPermissionDbModel> {
    return Global.instance.mongoDb.collection<IPermissionDbModel>('permission')
  }

  public async filter(): Promise<Permission[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => PermissionMap.toDomain(item))
  }

  public async findByName(name: string): Promise<Permission[]> {
    let list = await this.createCollection()
      .find({ name })
      .toArray()
    return list.map(item => PermissionMap.toDomain(item))
  }

  public async save(permission: Permission): Promise<void> {
    const permissionPersistence = await PermissionMap.toPersistence(permission)
    await this.createCollection().updateOne(
      { _id: permissionPersistence._id },
      {
        $set: {
          name: permissionPersistence.name,
          discriminator: permissionPersistence.discriminator
        }
      },
      { upsert: true }
    )
  }

  public async deleteById(_id: string): Promise<void> {
    await this.createCollection().deleteOne({ _id })
  }

  public async getById(_id: string): Promise<Permission> {
    let permission = await this.createCollection().findOne({ _id })
    return PermissionMap.toDomain(permission)
  }
}
