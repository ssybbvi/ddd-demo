
import { CommonRedisClient } from "../../../../shared/infra/database/redis/commonRedisClient";
import { redisConnection } from '../../../../shared/infra/database/redis/redisConnection'
import { CommodityCache } from "./commodityCache";
import { getCommodityUseCase } from "../../userCases/commoditys/getCommodity";

const commonRedisClient = new CommonRedisClient(redisConnection)
const commodityCache = new CommodityCache(getCommodityUseCase, commonRedisClient)

export { commodityCache }