import { MongoCommodityRepo } from './implementations/mongoCommodityRepo'
import { MongoPurchaseHistoryRepo } from './implementations/mongoPurchaseHistoryRepo'
import { MongoCommodityTagRepo } from './implementations/mongoCommodityTagRepo'
import { MongoCategoryRepo } from './implementations/mongoCategoryRepo'

const commodityRepo = new MongoCommodityRepo()
const purchaseHistoryRepo = new MongoPurchaseHistoryRepo()
const commodityTagRepo = new MongoCommodityTagRepo()
const categoryRepo = new MongoCategoryRepo()

export { commodityRepo, purchaseHistoryRepo, commodityTagRepo, categoryRepo }
