import { MongoOrderRepo } from './implementations/mongoOrderRepo'
import { MongoOrderUserRepo } from './implementations/mongoOrderUserRepo'
import { MongoBargainOrderRepo } from './implementations/mongoBargainOrderRepo'
import { MongoDeliveryOrderRepo } from './implementations/mongoDeliveryOrderRepo'

const orderRepo = new MongoOrderRepo()
const orderUserRepo = new MongoOrderUserRepo()
const bargainOrderRepo = new MongoBargainOrderRepo()
const deliveryOrderRepo = new MongoDeliveryOrderRepo()
export { orderRepo, orderUserRepo, bargainOrderRepo, deliveryOrderRepo }
