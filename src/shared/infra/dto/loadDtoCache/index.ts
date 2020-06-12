import { wxUserCache } from '../../../../modules/users/infra/cache'
import { MongodbWithTenant } from '../../database/mongodb/mongodbTenant'
import { clsNameSpace } from '../../cls'
import { commodityCache } from '../../../../modules/commoditys/infra/cache'
import { couponCache } from '../../../../modules/market/infra/cache'

const loadDtoCache = () => {
  return new Promise((res, rjc) => {
    const tenantIds = MongodbWithTenant.instance.getTenantIds()
    for (let item of tenantIds) {
      clsNameSpace.run(() => {
        console.log('xxxx=====================', item)
        clsNameSpace.set('tenantId', item)
        // Promise.all([wxUserCache.load(), commodityCache.load(), couponCache.load()]).then(() => res())
      })
    }
  })
}

export { loadDtoCache }
