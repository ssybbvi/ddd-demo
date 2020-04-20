import { AuthorizationCodeUseCase } from "./authorizationCodeUseCase"
import { AuthorizationCodeController } from "./authorizationCodeController"
import { appUserRepo, authCodeRepo, thirdPartyAppRepo } from "../../../repos"

const authorizationCodeUseCase = new AuthorizationCodeUseCase(appUserRepo, authCodeRepo, thirdPartyAppRepo)
const authorizationCodeController = new AuthorizationCodeController(authorizationCodeUseCase)

export { authorizationCodeUseCase, authorizationCodeController }
