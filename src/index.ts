require('dotenv').config()

import './shared/core/ErrorToString'

// Subscriptions
import './modules/users/subscriptions'
import './modules/distribution/subscriptions'
import './modules/funds/subscriptions'
import './modules/commoditys/subscriptions'
import './modules/jiFenYueDui/subscriptions'
import './modules/orders/subscriptions'
import './modules/oauth2/subscriptions'
import './cronTaskTemp'
import { Global } from './shared/infra/database/mongodb'
import { appLaunch } from './shared/infra/http/app'
import { commodityCache } from './modules/commoditys/infra/cache'
import { wxUserCache } from './modules/users/infra/cache'
import { MongodbWithTenant } from './shared/infra/database/mongodb/mongodbTenant'
import { clsNameSpace } from './shared/infra/cls'


const loadCache = async () => {
  // clsNameSpace.run(() => {
  //   clsNameSpace.set('tenantId', 'main')
  //   commodityCache.load()
  //   wxUserCache.load()
  // })
}

Global.instance
  .init()
  .then(() => MongodbWithTenant.instance.init())
  .then(() => Promise.all([appLaunch(), loadCache()]))
