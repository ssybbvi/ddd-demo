import { createAuthorityUser } from '../useCases/authorityUsers/createAuthorityUser'
import { AfterUserCreated } from './afterUserCreated'

// Subscriptions
new AfterUserCreated(createAuthorityUser)
