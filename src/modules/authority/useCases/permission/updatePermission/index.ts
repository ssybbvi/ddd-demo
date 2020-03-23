import { UpdatePermissionUseCase } from './updatePermissionUseCase'
import { permissionRepo } from '../../../repos'
import { UpdatePermissionController } from './updatePermissionController'

const updatePermissionUseCase = new UpdatePermissionUseCase(permissionRepo)

const updatePermissionController = new UpdatePermissionController(updatePermissionUseCase)

export { updatePermissionUseCase, updatePermissionController }
