import { CreateRobotUserCase } from './createRobotUserUseCase'
import { userRepo } from '../../repos'

const createRobotUserCase = new CreateRobotUserCase(userRepo)

export { createRobotUserCase }
