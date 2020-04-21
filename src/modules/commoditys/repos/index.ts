import { MongoCommodityRepo } from './implementations/mongoCommodityRepo'
import { MongoPurchaseHistoryRepo } from './implementations/mongoPurchaseHistoryRepo'
import { MongoCommodityTagRepo } from './implementations/mongoCommodityTagRepo'

const commodityRepo = new MongoCommodityRepo()
const purchaseHistoryRepo = new MongoPurchaseHistoryRepo()
const commodityTagRepo = new MongoCommodityTagRepo()

export { commodityRepo, purchaseHistoryRepo, commodityTagRepo }
