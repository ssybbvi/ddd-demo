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
import '../src/shared/infra/ws'
import { Global } from './shared/infra/database/mongodb'
import { appLaunch } from './shared/infra/http/app'
import { MongodbWithTenant } from './shared/infra/database/mongodb/mongodbTenant'
import { loadDtoCache } from './shared/infra/dto/loadDtoCache'


Global.instance
  .init()
  .then(() => MongodbWithTenant.instance.init())
  .then(() => appLaunch())
  .then(() => {
    // loadDtoCache()
  })
