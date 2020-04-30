require('dotenv').config()



import './shared/core/ErrorToString'
import './shared/infra/http/app'
import { Global } from './shared/infra/database/mongodb/index'
import { wxUserCache } from './modules/users/infra/cache';
import { commodityCache } from './modules/commoditys/infra/cache';
; (async () => {

  await Global.instance.init()
  wxUserCache.load()
  commodityCache.load()
})()

// Subscriptions
import './modules/users/subscriptions'
import './modules/distribution/subscriptions'
import './modules/funds/subscriptions'
import './modules/commoditys/subscriptions'
import './modules/jiFenYueDui/subscriptions'
import './modules/orders/subscriptions'
import './modules/oauth2/subscriptions'
import './cronTaskTemp'

