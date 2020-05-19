import { MongoOrderRepo } from './implementations/mongoOrderRepo'
import { MongoOrderUserRepo } from './implementations/mongoOrderUserRepo'
import { MongoBargainRepo } from './implementations/mongoBargainRepo'
import { MongoAddressUserRepo } from './implementations/mongoAddressRepo'

const orderRepo = new MongoOrderRepo()
const orderUserRepo = new MongoOrderUserRepo()
const bargainRepo = new MongoBargainRepo()
const addressUserRepo = new MongoAddressUserRepo()
export { orderRepo, orderUserRepo, bargainRepo, addressUserRepo }
