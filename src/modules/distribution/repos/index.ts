import { MemberRepo } from './implementations/mongoMemberRepo'
import { MongoSignInRepo } from './implementations/mongoSignInRepo'
import { MongoFundRepo } from './implementations/mongoFundRepo'
import { MongoFundAccountRepo } from './implementations/mongoFundAccountRepo'

const signInRepo = new MongoSignInRepo()
const memberRepo = new MemberRepo()
const fundRepo = new MongoFundRepo()
const fundAccountRepo = new MongoFundAccountRepo()

export { memberRepo, signInRepo, fundRepo, fundAccountRepo }
