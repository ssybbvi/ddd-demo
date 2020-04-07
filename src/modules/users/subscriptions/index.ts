import { craeteUseCase } from '../useCases/user/createUser'
import { AfterUpUserCreated } from './afterUpUserCreated'
import { AfterWxUserCreated } from './afterWxUserCreated'

new AfterUpUserCreated(craeteUseCase)
new AfterWxUserCreated(craeteUseCase)
