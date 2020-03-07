import { tenantRepo } from '../../../repos'
import { GetTenantUseCase } from './getTenantUseCase'
import { GetTenantController } from './getTenantController'

const getTenantUseCase = new GetTenantUseCase(tenantRepo)
const getTenantController = new GetTenantController(getTenantUseCase)

export { getTenantUseCase, getTenantController }
