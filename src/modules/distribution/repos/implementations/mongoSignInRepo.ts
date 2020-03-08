import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'
import { dispatchEventsCallback } from '../../../../shared/infra/database/mongodb/hooks'

import { ISignInRepo } from '../signInRepo'
import { ISignInDbModel } from '../../dbModels/iSignInDbModel'
import { SignIn } from '../../domain/signIn'
import { SignInMap } from '../../mappers/signInMap'

export class MongoSignInRepo implements ISignInRepo {
  constructor() {}

  private createCollection(): Collection<ISignInDbModel> {
    return Global.instance.mongoDb.collection<ISignInDbModel>('signIn')
  }

  public async getById(_id: string): Promise<SignIn> {
    let signIn = await this.createCollection().findOne({ _id })
    return SignInMap.toDomain(signIn)
  }

  public async filter(): Promise<SignIn[]> {
    let list = await this.createCollection()
      .find({})
      .toArray()
    return list.map(item => SignInMap.toDomain(item))
  }

  async save(signIn: SignIn): Promise<void> {
    const raw = await SignInMap.toPersistence(signIn)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          signInMemberId: signIn.signInMemberId,
          createAt: signIn.createAt,
          reward: signIn.reward
        }
      },
      { upsert: true }
    )
    dispatchEventsCallback(raw)
  }
}
