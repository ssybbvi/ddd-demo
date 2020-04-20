import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'


import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IThirdPartyAppRepo } from '../thirdPartyAppRepo'
import { IThirdPartyAppDbModel } from '../../dbModels/thirdPartyAppDbModel'
import { ThirdPartyApp } from '../../domain/thirdPartyApp'
import { ThirdPartyAppMap } from '../../mappers/thirdPartyAppMapper'

export class MongoThirdPartyAppRepo implements IThirdPartyAppRepo {
  constructor() { }

  private createCollection(): Collection<IThirdPartyAppDbModel> {
    return Global.instance.mongoDb.collection<IThirdPartyAppDbModel>('thirdPartyApp')
  }

  public async getById(_id: string): Promise<ThirdPartyApp> {
    let thirdPartyApp = await this.createCollection().findOne({ _id })
    return ThirdPartyAppMap.toDomain(thirdPartyApp)
  }

  public async save(thirdPartyApp: ThirdPartyApp): Promise<void> {
    const raw = await ThirdPartyAppMap.toPersistence(thirdPartyApp)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: thirdPartyApp.name,
          appId: thirdPartyApp.appId,
          secret: thirdPartyApp.secret,
          createAt: thirdPartyApp.createAt,
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(thirdPartyApp)
  }

  public async  getThirdPartyAppByAppId(appId: string): Promise<ThirdPartyApp> {
    console.log("existAppIdexistAppIdexistAppId", appId)
    let thirdPartyApp = await this.createCollection().findOne({ appId })
    return ThirdPartyAppMap.toDomain(thirdPartyApp)
  }

  public async  existName(name: string): Promise<boolean> {
    let thirdPartyApp = await this.createCollection().findOne({ name })
    return !!thirdPartyApp
  }

  public async existAppId(appId: string): Promise<boolean> {
    let thirdPartyApp = await this.createCollection().findOne({ appId })
    return !!thirdPartyApp
  }
}
