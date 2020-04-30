import { WxUserDtoCache } from "./wxUserDtoCache";
import { getListUseCase } from "../../useCases/wxUser/getList";
import { CommonRedisClient } from "../../../../shared/infra/database/redis/commonRedisClient";
import { redisConnection } from '../../../../shared/infra/database/redis/redisConnection'

const commonRedisClient = new CommonRedisClient(redisConnection)
const wxUserCache = new WxUserDtoCache(getListUseCase, commonRedisClient)

export { wxUserCache }