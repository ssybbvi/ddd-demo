import { RedisAuthService } from './redisAuthService'
import { redisConnection } from '../../../shared/infra/database/redis/redisConnection'
import { AuthorizationService } from './authorizationService'
import { WxAuthrizationService } from './wxAuthrizationService'

const authService = new RedisAuthService(redisConnection)
const authorizationService = new AuthorizationService(authService)
const wxAuthrizationService = new WxAuthrizationService()

export { authService, authorizationService, wxAuthrizationService }
