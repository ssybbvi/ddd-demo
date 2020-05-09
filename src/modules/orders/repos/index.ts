import { MongoOrderRepo } from './implementations/mongoOrderRepo'
import { MongoOrderUserRepo } from './implementations/mongoOrderUserRepo'
import { MongoBargainRepo } from './implementations/mongoBargainRepo'

const orderRepo = new MongoOrderRepo()
const orderUserRepo = new MongoOrderUserRepo()
const bargainRepo = new MongoBargainRepo()

export { orderRepo, orderUserRepo, bargainRepo }
