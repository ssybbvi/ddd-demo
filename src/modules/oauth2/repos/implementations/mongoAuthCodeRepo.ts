import { Db, MongoClient, Collection } from 'mongodb'

import { Global } from '../../../../shared/infra/database/mongodb'


import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IAuthCodeDbModel } from '../../dbModels/authCodeDbModel'
import { AuthCodeMap } from '../../mappers/authCodeMapper'
import { AuthCode } from '../../domain/authCode'
import { IAuthCodeRepo } from '../authCodeRepo'

export class MongoAuthCodeRepo implements IAuthCodeRepo {
  constructor() { }

  private createCollection(): Collection<IAuthCodeDbModel> {
    return Global.instance.mongoDb.collection<IAuthCodeDbModel>('authCode')
  }

  public async getById(_id: string): Promise<AuthCode> {
    let authCode = await this.createCollection().findOne({ _id })
    return AuthCodeMap.toDomain(authCode)
  }

  public async save(authCode: AuthCode): Promise<void> {
    const raw = await AuthCodeMap.toPersistence(authCode)
    await this.createCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          appId: authCode.appId,
          code: authCode.code,
          userId: authCode.userId,
          createAt: authCode.createAt,
          expiresIn: authCode.expiresIn,
        }
      },
      { upsert: true }
    )
    await DomainEvents.dispatchEventsForAggregate(authCode)
  }

  public async getAuthCodeByAppIdWithCode(appId: string, code: string): Promise<AuthCode> {
    const authCode = await this.createCollection().findOne({ appId, code })
    return AuthCodeMap.toDomain(authCode)
  }

  public async  getAuthCodeByAppIdWithUserId(appId: string, userId: string): Promise<AuthCode> {
    const authCode = await this.createCollection().findOne({ appId, userId })
    return AuthCodeMap.toDomain(authCode)
  }
}
