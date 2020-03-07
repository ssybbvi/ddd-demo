import { tenantRepo } from '../../../repos'
import { CreateTenantUseCase } from './createTenantUseCase'
import { CreateTenantController } from './createTenantController'

const createTenantUseCase = new CreateTenantUseCase(tenantRepo)
const createTenantController = new CreateTenantController(createTenantUseCase)

export { createTenantUseCase, createTenantController }
