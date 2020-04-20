import { CreateThirdPartyAppUseCase } from "./createThirdPartyAppUseCase"
import { CreateThirdPartyAppController } from "./createThirdPartyAppController"
import { thirdPartyAppRepo } from "../../../repos"


const createThirdPartyAppUseCase = new CreateThirdPartyAppUseCase(thirdPartyAppRepo)
const createThirdPartyAppController = new CreateThirdPartyAppController(createThirdPartyAppUseCase)

export { createThirdPartyAppUseCase, createThirdPartyAppController }