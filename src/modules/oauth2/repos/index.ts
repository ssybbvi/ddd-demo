import { MongoAppUserRepo } from "./implementations/mongoAppUserRepo";
import { MongoThirdPartyAppRepo } from "./implementations/mongoThirdPartyApp";
import { redisConnection } from '../../../shared/infra/database/redis/redisConnection'
import { MongoAuthCodeRepo } from "./implementations/mongoAuthCodeRepo";

const appUserRepo = new MongoAppUserRepo()
const thirdPartyAppRepo = new MongoThirdPartyAppRepo()
const authCodeRepo = new MongoAuthCodeRepo() // new ReidsAuthCodeRepo(redisConnection)

export { appUserRepo, thirdPartyAppRepo, authCodeRepo }