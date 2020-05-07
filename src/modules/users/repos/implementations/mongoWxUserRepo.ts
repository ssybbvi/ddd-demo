import { IWxUserRepo } from '../wxUserRepo'
import { IWxUserDbModels } from '../../dbModels/iWxUserDbModels'
import { WxUserMap } from '../../mappers/wxUserMap'
import { WxUser } from '../../domain/wxUser'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoWxUserRepo implements IWxUserRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IWxUserDbModels> {
    return MongodbWithTenant.instance.Collection<IWxUserDbModels>('wxUser')
  }

  public async getById(_id: string): Promise<WxUser> {

    let wxUser = await this.getCollection().findOne({ _id })
    return WxUserMap.toDomain(wxUser)
  }

  public async filter(): Promise<WxUser[]> {
    let list = await this.getCollection()
      .find({})
      .toArray()
    return list.map(item => WxUserMap.toDomain(item))
  }

  async save(wxUser: WxUser): Promise<void> {


    const raw = await WxUserMap.toPersistence(wxUser)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          openId: wxUser.openId,
          unionId: wxUser.unionId,
          sessionKey: wxUser.sessionKey,
          nickName: wxUser.nickName,
          avatarUrl: wxUser.avatarUrl,
          gender: wxUser.gender,
          phoneNumber: wxUser.phoneNumber
        }
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(wxUser)
  }

  async getUserByWxOpenId(wxOpenId: string): Promise<WxUser> {
    const baseUser = await this.getCollection().findOne({
      openId: wxOpenId
    })
    return WxUserMap.toDomain(baseUser)
  }

  async existsWxOpenId(wxOpenId: string): Promise<boolean> {
    const baseUser = await this.getCollection().findOne({
      openId: wxOpenId
    })
    return !!baseUser === true
  }
}
