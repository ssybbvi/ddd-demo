import { IWxUserRepo } from '../wxUserRepo'
import { Collection } from 'mongodb'
import { IWxUserDbModels } from '../../dbModels/iWxUserDbModels'
import { Global } from '../../../../shared/infra/database/mongodb'
import { WxUserMap } from '../../mappers/wxUserMap'
import { WxUser } from '../../domain/wxUser'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongoWxUserRepo implements IWxUserRepo {
  constructor() { }

  private createCollection(): Collection<IWxUserDbModels> {
    return Global.instance.mongoDb.collection<IWxUserDbModels>('wxUser')
  }

  public async getById(_id: string): Promise<WxUser> {

    let wxUser = await this.createCollection().findOne({ _id })
    return WxUserMap.toDomain(wxUser)
  }

  public async filter(): Promise<WxUser[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => WxUserMap.toDomain(item))
  }

  async save(wxUser: WxUser): Promise<void> {


    const raw = await WxUserMap.toPersistence(wxUser)
    await this.createCollection().updateOne(
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
    const baseUser = await this.createCollection().findOne({
      openId: wxOpenId
    })
    return WxUserMap.toDomain(baseUser)
  }

  async existsWxOpenId(wxOpenId: string): Promise<boolean> {
    const baseUser = await this.createCollection().findOne({
      openId: wxOpenId
    })
    return !!baseUser === true
  }
}
