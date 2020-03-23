import { permissionRepo } from '../../../repos'
import { CreatePermissionUseCase } from './createPermissionUseCase'
import { CreatePermissionController } from './createPermissionController'

const createPermissionUseCase = new CreatePermissionUseCase(permissionRepo)
const createPermissionController = new CreatePermissionController(createPermissionUseCase)

export { createPermissionUseCase, createPermissionController }
