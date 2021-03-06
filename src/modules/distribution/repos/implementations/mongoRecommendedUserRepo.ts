import { IRecommendedUserRepo } from '../recommendedUserRepo'
import { RecommendedUser } from '../../domain/recommendedUser'
import { RecommendedUserMap } from '../../mappers/recommendedUserMap'
import { RecommendedUserId } from '../../domain/recommendedUserId'
import { Global } from '../../../../shared/infra/database/mongodb'
import { IRecommendedUserDbModel } from '../../dbModels/iRecommendedUserDbModel'
import { Collection } from 'mongodb'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class RecommendedUserRepo implements IRecommendedUserRepo {
  constructor() { }

  private getCollection(): MongodbWithTenantCollection<IRecommendedUserDbModel> {
    return MongodbWithTenant.instance.Collection<IRecommendedUserDbModel>('recommendedUser')
  }

  public async existsById(_id: string): Promise<boolean> {
    const recommendedUser = await this.getCollection().findOne({ _id })
    const found = !!recommendedUser === true
    return found
  }

  public async getById(_id: string): Promise<RecommendedUser> {
    const recommendedUser = await this.getCollection().findOne({ _id })
    return RecommendedUserMap.toDomain(recommendedUser)
  }

  public async save(recommendedUser: RecommendedUser): Promise<void> {
    const raw = await RecommendedUserMap.toPersistence(recommendedUser)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          distributionRelationList: raw.distributionRelationList
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(recommendedUser)
  }

  public async existsByInviteToken(inviteToken: string): Promise<boolean> {
    const recommendedUser = await this.getCollection().findOne({ inviteToken })
    const found = !!recommendedUser === true
    return found
  }

  public async getByInviteToken(inviteToken: string): Promise<RecommendedUser> {
    const recommendedUser = await this.getCollection().findOne({ inviteToken })
    const found = !!recommendedUser === true
    if (!found) throw new Error('RecommendedUser id not found')
    return RecommendedUserMap.toDomain(recommendedUser)
  }

  public async getTeamRecommendedUserList(recommendedUserIdList: RecommendedUserId[]): Promise<RecommendedUser[]> {
    let recommendedUserIds = recommendedUserIdList.map(item => item.id.toString())

    let recommendedUserList = await this.getCollection()
      .find({
        inviteToken: {
          $in: recommendedUserIds
        }
      })
      .toArray()
    return recommendedUserList.map(item => RecommendedUserMap.toDomain(item))
  }
}
