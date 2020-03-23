import { GetPermissionUseCase } from './getPermissionUseCase'
import { permissionRepo } from '../../../repos'
import { GetPermissionController } from './getPermissionController'

const getPermissionUseCase = new GetPermissionUseCase(permissionRepo)

const getPermissionController = new GetPermissionController(getPermissionUseCase)

export { getPermissionUseCase, getPermissionController }
