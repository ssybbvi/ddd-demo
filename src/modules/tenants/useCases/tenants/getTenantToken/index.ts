import { GetTenantTokenUseCase } from "./getTenantTokenUseCase";
import { tenantRepo } from "../../../repos";
import { authService } from "../../../../../shared/infra/auth";
import { GetTenantTokenController } from "./getTenantTokenController";


const getTenantTokenUseCase = new GetTenantTokenUseCase(tenantRepo, authService)
const getTenantTokenController = new GetTenantTokenController(getTenantTokenUseCase)

export { getTenantTokenUseCase, getTenantTokenController }