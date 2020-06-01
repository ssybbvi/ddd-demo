import { MongodbCouponRepo } from './implementations/mongodbCouponRepo'
import { MongodbCouponUserRepo } from './implementations/mongodbCouponUserRepo'
import { MongodbActivityRepo } from './implementations/mongodbActivityRepo'

const couponRepo = new MongodbCouponRepo()
const activityRepo = new MongodbActivityRepo()
const couponUserRepo = new MongodbCouponUserRepo()

export { couponRepo, activityRepo, couponUserRepo }
