import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { dispatchEventsCallback } from '../../../../shared/infra/database/mongodb/hooks'

import { ISignInRepo } from '../signInRepo'
import { ISignInDbModel } from '../../dbModels/iSignInDbModel'
import { SignIn } from '../../domain/signIn'
import { SignInMap } from '../../mappers/signInMap'
import { MemberId } from '../../domain/memberId'
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

  public async filter(memberId: string, limit: number): Promise<SignIn[]> {
    let list = await this.createCollection()
      .find({ memberId })
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
          memberId: signIn.memberId,
          createAt: signIn.createAt,
          reward: signIn.reward
        }
      },
      { upsert: true }
    )
    DomainEvents.dispatchEventsForAggregate(signIn.id)
  }

  public async existToday(memberId: string): Promise<boolean> {
    let signIn = await this.createCollection().findOne({
      memberId: memberId,
      createAt: {
        $gt: new Date().setHours(0, 0, 0, 0)
      }
    })

    return !!signIn === true
  }

  public async getToday(memberId: string): Promise<SignIn> {
    let signIn = await this.createCollection().findOne({
      memberId: memberId,
      createAt: {
        $gt: new Date().setHours(0, 0, 0, 0)
      }
    })

    return SignInMap.toDomain(signIn)
  }
}
