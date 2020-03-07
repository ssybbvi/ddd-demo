import { CreateMember } from './createMember'
import { memberRepo } from '../../../repos'

const createMember = new CreateMember(memberRepo)

export { createMember }
