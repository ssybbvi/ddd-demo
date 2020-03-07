require('dotenv').config()
// Infra
import './shared/infra/http/app'
import { Global } from './shared/infra/database/mongodb/index'
;(async () => {
  await Global.instance.init()
})()

// Subscriptions
import './modules/distribution/subscriptions'
