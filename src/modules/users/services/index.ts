import { RedisAuthService } from './redisAuthService'
import { redisConnection } from '../../../shared/infra/database/redis/redisConnection'

const authService = new RedisAuthService(redisConnection)

export { authService }
