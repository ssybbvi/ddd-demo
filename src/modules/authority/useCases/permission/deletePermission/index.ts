import { DeletePermissionUseCase } from './deletePermissionUseCase'
import { permissionRepo } from '../../../repos'
import { DeletePermissionController } from './deletePermissionController'

const deletePermissionUseCase = new DeletePermissionUseCase(permissionRepo)

const deletePermissionController = new DeletePermissionController(deletePermissionUseCase)

export { deletePermissionUseCase, deletePermissionController }
