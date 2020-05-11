import { MongodbCouponRepo } from "./implementations/mongodbCouponRepo";
import { MongodbStrategyRepo } from "./implementations/mongodbStrategy";

const couponRepo = new MongodbCouponRepo()
const strategyRepo = new MongodbStrategyRepo()

export { couponRepo, strategyRepo }