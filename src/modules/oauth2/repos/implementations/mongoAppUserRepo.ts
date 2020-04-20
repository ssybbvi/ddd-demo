import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'


import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IAppUserRepo } from '../appUserRepo'
import { IAppUserDbModel } from '../../dbModels/appUserDbModel'
import { AppUserMap } from '../../mappers/appUserMapper'
import { AppUser } from '../../domain/appUser'

export class MongoAppUserRepo implements IAppUserRepo {
  constructor() { }

  private createCollection(): Collection<IAppUserDbModel> {
    return Global.instance.mongoDb.collection<IAppUserDbModel>('appUser')
  }

  public async getById(_id: string): Promise<AppUser> {
    let appUser = await this.createCollection().findOne({ _id })
    return AppUserMap.toDomain(appUser)
  }

  public async save(appUser: AppUser): Promise<void> {
    const raw = await AppUserMap.toPersistence(appUser)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          appId: appUser.appId,
          userId: appUser.userId,
          openUserId: appUser.openUserId,
          createAt: appUser.createAt,
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(appUser)
  }

  public async getAppUserByAppIdWithUserId(appId: string, userId: string): Promise<AppUser> {
    const appUser = await this.createCollection().findOne({ appId, userId })
    return AppUserMap.toDomain(appUser)
  }


}
