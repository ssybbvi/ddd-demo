import { MongoUserRepo } from './implementations/mongoUserRepo'
import { MongoWxUserRepo } from './implementations/mongoWxUserRepo'
import { MongoUpUserRepo } from './implementations/mongoUpUserRepo'

const userRepo = new MongoUserRepo()
const wxUserRepo = new MongoWxUserRepo()
const upUserRepo = new MongoUpUserRepo()

export { userRepo, wxUserRepo, upUserRepo }
