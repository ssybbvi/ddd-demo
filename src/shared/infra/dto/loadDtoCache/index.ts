import { wxUserCache } from "../../../../modules/users/infra/cache";
import { MongodbWithTenant } from "../../database/mongodb/mongodbTenant";
import { clsNameSpace } from "../../cls";
import { commodityCache } from "../../../../modules/commoditys/infra/cache";


const loadDtoCache = () => {
  const tenantIds = MongodbWithTenant.instance.getTenantIds()
  for (let item of tenantIds) {
    clsNameSpace.run(() => {
      clsNameSpace.set('tenantId', item)
      wxUserCache.load()
      commodityCache.load()
    })
  }
}

export { loadDtoCache }
