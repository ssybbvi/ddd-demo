import { MongoCommodityRepo } from './implementations/mongoCommodityRepo'
import { MongoPurchaseHistoryRepo } from './implementations/mongoPurchaseHistoryRepo'

const commodityRepo = new MongoCommodityRepo()
const purchaseHistoryRepo = new MongoPurchaseHistoryRepo()
export { commodityRepo, purchaseHistoryRepo }
