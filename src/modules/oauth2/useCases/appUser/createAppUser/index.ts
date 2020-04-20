import { CreateAppUserUseCase } from "./createAppUserUseCase"
import { appUserRepo } from "../../../repos"

const createAppUserUseCase = new CreateAppUserUseCase(appUserRepo)

export { createAppUserUseCase }