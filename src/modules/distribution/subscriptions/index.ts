import { createMember } from '../userCases/members/createMember'
import { AfterUserCreated } from './afterUserCreated'

// Subscriptions
new AfterUserCreated(createMember)
