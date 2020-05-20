import { MongoCommodityRepo } from './implementations/mongoCommodityRepo'
import { MongoPurchaseHistoryRepo } from './implementations/mongoPurchaseHistoryRepo'
import { MongoCommodityTagRepo } from './implementations/mongoCommodityTagRepo'
import { MongoAttributeRepo } from './implementations/mongoAttibuteRepo'
import { MongoCategoryRepo } from './implementations/mongoCategoryRepo'
import { MongoSpecificationRepo } from './implementations/mongoSpecificationRepo'

const commodityRepo = new MongoCommodityRepo()
const purchaseHistoryRepo = new MongoPurchaseHistoryRepo()
const commodityTagRepo = new MongoCommodityTagRepo()
const attributeRepo = new MongoAttributeRepo()
const categoryRepo = new MongoCategoryRepo()
const specificationRepo = new MongoSpecificationRepo()

export { commodityRepo, purchaseHistoryRepo, commodityTagRepo, attributeRepo, categoryRepo, specificationRepo }
