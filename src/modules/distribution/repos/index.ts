import { RecommendedUserRepo } from './implementations/mongoRecommendedUserRepo'
import { MongoSignInRepo } from './implementations/mongoSignInRepo'

const signInRepo = new MongoSignInRepo()
const recommendedUserRepo = new RecommendedUserRepo()

export { recommendedUserRepo, signInRepo }
