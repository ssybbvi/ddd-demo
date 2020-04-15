require('dotenv').config()
// Infra
import './shared/core/ErrorToString'
import './shared/infra/http/app'
import { Global } from './shared/infra/database/mongodb/index'
  ; (async () => {
    await Global.instance.init()
  })()

// Subscriptions
import './modules/users/subscriptions'
import './modules/distribution/subscriptions'
import './modules/funds/subscriptions'
import './modules/commoditys/subscriptions'
import './modules/jiFenYueDui/subscriptions'
import './modules/orders/subscriptions'
import './cronTaskTemp'
