import { GetUpCurrentUserUseCase } from "./getUpCurrentUserUseCase"
import { GetUpCurrentUserController } from "./getUpCurrentUserController"
import { upUserRepo } from "../../../repos"


const getUpCurrentUserUseCase = new GetUpCurrentUserUseCase(upUserRepo)
const getUpCurrentUserController = new GetUpCurrentUserController(getUpCurrentUserUseCase)

export { getUpCurrentUserUseCase, getUpCurrentUserController }