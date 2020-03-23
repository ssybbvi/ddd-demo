import { GetRoleUseCase } from './getRoleUseCase'
import { roleRepo } from '../../../repos'
import { GetRoleController } from './getRoleControllter'

const getRoleUseCase = new GetRoleUseCase(roleRepo)

const getRoleController = new GetRoleController(getRoleUseCase)

export { getRoleUseCase, getRoleController }
