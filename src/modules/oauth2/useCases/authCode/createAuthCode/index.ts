import { CreateAuthCodeUseCase } from "./createAuthCodeUseCase";
import { CreateAuthCodeController } from "./createAuthCodeController";
import { authCodeRepo, thirdPartyAppRepo } from "../../../repos";


const createAuthCodeUseCase = new CreateAuthCodeUseCase(authCodeRepo, thirdPartyAppRepo)
const createAuthCodeController = new CreateAuthCodeController(createAuthCodeUseCase)

export { createAuthCodeUseCase, createAuthCodeController }