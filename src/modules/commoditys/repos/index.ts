import { MongoCommodityRepo } from './implementations/mongoCommodityRepo'
import { MongoPurchaseHistoryRepo } from './implementations/mongoPurchaseHistoryRepo'
import { MongoCommodityTagRepo } from './implementations/mongoCommodityTagRepo'
import { MongodbWithTenant } from '../../../shared/infra/database/mongodb/mongodbTenant'
import { MongoxxxRepo } from './implementations/xxxRepo'

const mongodbWithTenant = new MongodbWithTenant('commodity')

const commodityRepo1 = new MongoxxxRepo(mongodbWithTenant)

const commodityRepo = new MongoCommodityRepo()
const purchaseHistoryRepo = new MongoPurchaseHistoryRepo()
const commodityTagRepo = new MongoCommodityTagRepo()

export { commodityRepo, purchaseHistoryRepo, commodityTagRepo, commodityRepo1 }
