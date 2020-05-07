
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IThirdPartyAppRepo } from '../thirdPartyAppRepo'
import { IThirdPartyAppDbModel } from '../../dbModels/thirdPartyAppDbModel'
import { ThirdPartyApp } from '../../domain/thirdPartyApp'
import { ThirdPartyAppMap } from '../../mappers/thirdPartyAppMapper'
import { MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoThirdPartyAppRepo implements IThirdPartyAppRepo {
  private getCollection() {
    return MongodbWithTenant.instance.Collection<IThirdPartyAppDbModel>('thirdPartyApp')
  }

  public async getById(_id: string): Promise<ThirdPartyApp> {
    let thirdPartyApp = await this.getCollection().findOne({ _id })
    return ThirdPartyAppMap.toDomain(thirdPartyApp)
  }

  public async save(thirdPartyApp: ThirdPartyApp): Promise<void> {
    const raw = await ThirdPartyAppMap.toPersistence(thirdPartyApp)
    await this.getCollection().updateOne(
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

    let thirdPartyApp = await this.getCollection().findOne({ appId })
    return ThirdPartyAppMap.toDomain(thirdPartyApp)
  }

  public async  existName(name: string): Promise<boolean> {
    let thirdPartyApp = await this.getCollection().findOne({ name })
    return !!thirdPartyApp
  }

  public async existAppId(appId: string): Promise<boolean> {
    let thirdPartyApp = await this.getCollection().findOne({ appId })
    return !!thirdPartyApp
  }
}
