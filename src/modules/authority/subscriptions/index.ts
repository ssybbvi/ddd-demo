import { createAuthorityUserUseCase } from '../useCases/authorityUsers/createAuthorityUser'
import { AfterUserCreated } from './afterUserCreated'

// Subscriptions
new AfterUserCreated(createAuthorityUserUseCase)
