import { MongoFundRepo } from './implementations/mongoFundRepo'
import { MongoFundAccountRepo } from './implementations/mongoFundAccountRepo'

const fundRepo = new MongoFundRepo()
const fundAccountRepo = new MongoFundAccountRepo()

export { fundRepo, fundAccountRepo }
