import { MemberRepo } from './implementations/mongoMemberRepo'
import { MongoSignInRepo } from './implementations/mongoSignInRepo'

const signInRepo = new MongoSignInRepo()
const memberRepo = new MemberRepo()

export { memberRepo, signInRepo }
