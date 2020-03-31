require('dotenv').config()
// Infra
import './shared/infra/http/app'
import { Global } from './shared/infra/database/mongodb/index'
  ; (async () => {
    await Global.instance.init()
  })()

// Subscriptions
import './modules/distribution/subscriptions'
import './modules/funds/subscriptions'
import './modules/commoditys/subscriptions'
import './modules/jiFenYueDui/subscriptions'

// appid: 'wx03241bf8686d6292',
// secret: 'f1dddcaf1e6dd2638c75925740c8198e'
