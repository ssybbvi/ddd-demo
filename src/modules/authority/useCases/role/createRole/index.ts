import { roleRepo } from '../../../repos'
import { CreateRoleUseCase } from './createRoleUseCase'
import { CreateRoleController } from './createRoleContorller'

const createRoleUseCase = new CreateRoleUseCase(roleRepo)
const createRoleController = new CreateRoleController(createRoleUseCase)

export { createRoleUseCase, createRoleController }
