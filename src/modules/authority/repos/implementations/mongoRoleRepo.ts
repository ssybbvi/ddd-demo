import { IRoleRepo } from '../roleRepo'
import { Role } from '../../domain/role'
import { Global } from '../../../../shared/infra/database/mongodb'
import { Collection } from 'mongodb'
import { IRoleDbModel } from '../../dbModels/iRoleDbModel'
import { RoleMap } from '../../mappers/roleMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongoRoleRepo implements IRoleRepo {
  private createCollection(): Collection<IRoleDbModel> {
    return Global.instance.mongoDb.collection<IRoleDbModel>('role')
  }

  public async filter(): Promise<Role[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => RoleMap.toDomain(item))
  }

  public async findByName(name: string): Promise<Role[]> {
    let list = await this.createCollection()
      .find({ name })
      .toArray()
    return list.map(item => RoleMap.toDomain(item))
  }

  public async update(roleId: string, name: string, description: string): Promise<void> {
    await this.createCollection().updateOne(
      { _id: roleId },
      {
        $set: {
          name,
          description
        }
      }
    )
    return
  }

  public async save(role: Role): Promise<void> {
    const rolePersistence = await RoleMap.toPersistence(role)

    await this.createCollection().updateOne(
      { _id: rolePersistence._id },
      {
        $set: {
          name: rolePersistence.name,
          description: rolePersistence.description,
          permissionIds: rolePersistence.permissionIds
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(role)
  }

  public async deleteById(_id: string): Promise<void> {
    await this.createCollection().deleteOne({ _id })
  }

  public async getById(_id: string): Promise<Role> {
    let role = await this.createCollection().findOne({ _id })
    return RoleMap.toDomain(role)
  }
}
