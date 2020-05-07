import express from 'express'
import { createTenantController } from '../../../useCases/tenants/createTenant'
import { getTenantController } from '../../../useCases/tenants/getTenant'
import { getTenantTokenController } from '../../../useCases/tenants/getTenantToken'

const tenantRouter = express.Router()

tenantRouter.post('/', (req, res) => createTenantController.execute(req, res))
tenantRouter.post('/getTenantToken', (req, res) => getTenantTokenController.execute(req, res))
tenantRouter.get('/', (req, res) => getTenantController.execute(req, res))

export { tenantRouter }
