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
import { TenantManager } from './shared/infra/tenant/tenantManager'
import { appLaunch } from './shared/infra/http/app'
import { commodityCache } from './modules/commoditys/infra/cache'
import { wxUserCache } from './modules/users/infra/cache'

Global.instance
  .init()
  .then(() => TenantManager.instance.init())
  .then(() => Promise.all([appLaunch(), commodityCache.load(), wxUserCache.load()]))
