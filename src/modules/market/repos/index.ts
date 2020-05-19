import { MongodbCouponRepo } from './implementations/mongodbCouponRepo'
import { MongodbStrategyRepo } from './implementations/mongodbStrategy'
import { MongodbCouponUserRepo } from './implementations/mongodbCouponUserRepo'

const couponRepo = new MongodbCouponRepo()
const strategyRepo = new MongodbStrategyRepo()
const couponUserRepo = new MongodbCouponUserRepo()
export { couponRepo, strategyRepo, couponUserRepo }
