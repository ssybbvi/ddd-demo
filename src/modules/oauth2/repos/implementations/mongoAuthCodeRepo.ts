import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IAuthCodeDbModel } from '../../dbModels/authCodeDbModel'
import { AuthCodeMap } from '../../mappers/authCodeMapper'
import { AuthCode } from '../../domain/authCode'
import { IAuthCodeRepo } from '../authCodeRepo'
import { MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoAuthCodeRepo implements IAuthCodeRepo {

  private getCollection() {
    return MongodbWithTenant.instance.Collection<IAuthCodeDbModel>('authCode')
  }

  public async getById(_id: string): Promise<AuthCode> {
    let authCode = await this.getCollection().findOne({ _id })
    return AuthCodeMap.toDomain(authCode)
  }

  public async save(authCode: AuthCode): Promise<void> {
    const raw = await AuthCodeMap.toPersistence(authCode)
    await this.getCollection().updateOne(
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
    const authCode = await this.getCollection().findOne({ appId, code })
    return AuthCodeMap.toDomain(authCode)
  }

  public async  getAuthCodeByAppIdWithUserId(appId: string, userId: string): Promise<AuthCode> {
    const authCode = await this.getCollection().findOne({ appId, userId })
    return AuthCodeMap.toDomain(authCode)
  }
}
