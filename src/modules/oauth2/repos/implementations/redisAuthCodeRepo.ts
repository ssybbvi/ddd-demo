// import { Db, MongoClient, Collection } from 'mongodb'


// import { RedisClient } from 'redis'
// import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
// import { IAuthCodeDbModel } from '../../dbModels/authCodeDbModel'
// import { AuthCode } from '../../domain/authCode'
// import { IAuthCodeRepo } from '../authCodeRepo'
// import { AuthCodeMap } from '../../mappers/authCodeMapper'
// import { AbstractRedisClient } from '../../../../shared/infra/database/redis/abstractRedisClient'

// export class ReidsAuthCodeRepo extends AbstractRedisClient implements IAuthCodeRepo {
//   constructor(redisClient: RedisClient) {
//     super(redisClient)
//   }


//   public async getById(_id: string): Promise<AuthCode> {
//     let authCode = await this.getOne<IAuthCodeDbModel>(_id)
//     return AuthCodeMap.toDomain(authCode)
//   }

//   public async save(authCode: AuthCode): Promise<void> {
//     const raw = await AuthCodeMap.toPersistence(authCode)
//     await this.set(raw._id.toString(), raw, raw.expiresIn)
//     await DomainEvents.dispatchEventsForAggregate(authCode)
//   }

//   async getAuthCodeByAppIdWithCode(appId: string, code: string): Promise<AuthCode> {
//     return 
//   }
// }
