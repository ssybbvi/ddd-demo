import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { v1Router } from './api/v1'
import { middleware } from '.'
//import { isProduction } from '../../../config'

const origin = {
  // origin: isProduction ? 'https://xxx.com' : '*',
  origin: '*',
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(helmet())
app.use(morgan('combined'))
app.use(middleware.ensureAuthenticatedTenant())
app.use('/api/v1', v1Router)

const port = process.env.PORT || 5000

const appLaunch = () => {
  return new Promise((res, rjc) => {
    app.listen(port, () => {
      res()
      console.log(`[App]: Listening on port ${port}`)
    })
  })
}
export { appLaunch }
