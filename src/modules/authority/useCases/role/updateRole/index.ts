import { UpdateRoleUseCase } from './updateRoleUseCase'
import { roleRepo } from '../../../repos'
import { UpdateRoleController } from './updateRoleController'

const updateRoleUseCase = new UpdateRoleUseCase(roleRepo)

const updateRoleController = new UpdateRoleController(updateRoleUseCase)

export { updateRoleUseCase, updateRoleController }
