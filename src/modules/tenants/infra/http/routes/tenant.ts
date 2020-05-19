import express from 'express'
import { createTenantController } from '../../../useCases/tenants/createTenant'
import { getTenantController } from '../../../useCases/tenants/getTenant'

const tenantRouter = express.Router()

tenantRouter.post('/', (req, res) => createTenantController.execute(req, res))
tenantRouter.get('/', (req, res) => getTenantController.execute(req, res))

export { tenantRouter }
