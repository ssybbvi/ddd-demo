import { TestLoginController } from './testLoginController'
import { TestLoginUseCase } from './testLoginUseCase'
import { loginUserUseCase } from '../login'

const testLoginUseCase = new TestLoginUseCase(loginUserUseCase)

const testLoginController = new TestLoginController(testLoginUseCase)

export { testLoginUseCase, testLoginController }
