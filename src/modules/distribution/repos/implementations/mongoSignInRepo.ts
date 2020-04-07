import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'

import { ISignInRepo } from '../signInRepo'
import { ISignInDbModel } from '../../dbModels/iSignInDbModel'
import { SignIn } from '../../domain/signIn'
import { SignInMap } from '../../mappers/signInMap'
import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'

export class MongoSignInRepo implements ISignInRepo {
  constructor() {}

  private createCollection(): Collection<ISignInDbModel> {
    return Global.instance.mongoDb.collection<ISignInDbModel>('signIn')
  }

  public async getById(_id: string): Promise<SignIn> {
    let signIn = await this.createCollection().findOne({ _id })
    return SignInMap.toDomain(signIn)
  }

  public async filter(userId: string, limit: number): Promise<SignIn[]> {
    let list = await this.createCollection()
      .find({ userId })
      .limit(limit)
      .sort({
        createAt: -1
      })
      .toArray()
    return list.map(item => SignInMap.toDomain(item))
  }

  public async save(signIn: SignIn): Promise<void> {
    const raw = await SignInMap.toPersistence(signIn)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          userId: signIn.userId,
          createAt: signIn.createAt,
          reward: signIn.reward,
          superReward: signIn.superReward
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(signIn)
  }

  public async existToday(userId: string): Promise<boolean> {
    let signIn = await this.createCollection().findOne({
      userId: userId,
      createAt: {
        $gt: new Date().setHours(0, 0, 0, 0)
      }
    })

    return !!signIn === true
  }

  public async getToday(userId: string): Promise<SignIn> {
    let signIn = await this.createCollection().findOne({
      userId: userId,
      createAt: {
        $gt: new Date().setHours(0, 0, 0, 0)
      }
    })

    return SignInMap.toDomain(signIn)
  }

  public async getCountByUserId(userId: string): Promise<number> {
    let count = await this.createCollection().count({
      userId: userId
    })
    return count
  }
}
