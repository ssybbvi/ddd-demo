import { MemberRepo } from './implementations/mongoMemberRepo'
import { MongoSignInRepo } from './implementations/mongoSignInRepo'
import { MongoFundRepo } from './implementations/mongoFundRepo'

const signInRepo = new MongoSignInRepo()
const memberRepo = new MemberRepo()
const fundRepo = new MongoFundRepo()

export { memberRepo, signInRepo, fundRepo }
