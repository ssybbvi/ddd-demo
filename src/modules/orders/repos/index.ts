import { MongoOrderRepo } from './implementations/mongoOrderRepo'
import { MongoOrderUserRepo } from './implementations/mongoOrderUserRepo'

const orderRepo = new MongoOrderRepo()
const orderUserRepo = new MongoOrderUserRepo()

export { orderRepo, orderUserRepo }
