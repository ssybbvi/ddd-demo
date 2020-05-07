import { RedisAuthService } from './redisAuthService'
import { redisConnection } from '../database/redis/redisConnection'

const authService = new RedisAuthService(redisConnection)

export { authService }
