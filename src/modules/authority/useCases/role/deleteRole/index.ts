import { DeleteRoleUseCase } from './deleteRoleUseCase'
import { roleRepo } from '../../../repos'
import { DeleteRoleController } from './deleteRoleController'

const deleteRoleUseCase = new DeleteRoleUseCase(roleRepo)

const deleteRoleController = new DeleteRoleController(deleteRoleUseCase)

export { deleteRoleUseCase, deleteRoleController }
