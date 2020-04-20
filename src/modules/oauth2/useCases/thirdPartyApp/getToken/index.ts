import { GetTokenUseCase } from "./getTokenUseCase"
import { GetTokenController } from "./getTokenController"
import { thirdPartyAppRepo } from "../../../repos"


const getTokenUseCase = new GetTokenUseCase(thirdPartyAppRepo)
const getTokenController = new GetTokenController(getTokenUseCase)

export { getTokenUseCase, getTokenController }