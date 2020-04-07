import { RedisAuthService } from './redisAuthService'
import { redisConnection } from '../../../shared/infra/database/redis/redisConnection'
import { WxAuthrizationService } from './wxAuthrizationService'

const authService = new RedisAuthService(redisConnection)
const wxAuthrizationService = new WxAuthrizationService()

export { authService, wxAuthrizationService }
