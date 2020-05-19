import { CommonRedisClient } from '../../../../shared/infra/database/redis/commonRedisClient'
import { redisConnection } from '../../../../shared/infra/database/redis/redisConnection'
import { CouponDtoCache } from './couponDtoCache'
import { getCouponListUseCase } from '../../useCases/coupon/getCouponList'

console.log('==========cahce index')
const commonRedisClient = new CommonRedisClient(redisConnection)
const couponCache = new CouponDtoCache(getCouponListUseCase, commonRedisClient)

export { couponCache }
