import { BindindUseInfoUseCase } from "./bindindUseInfoUseCase"
import { BindindUseInfoController } from "./bindindUseInfoController"
import { wxUserRepo } from "../../../repos"


const bindindUseInfoUseCase = new BindindUseInfoUseCase(wxUserRepo)
const bindindUseInfoController = new BindindUseInfoController(bindindUseInfoUseCase)

export { bindindUseInfoUseCase, bindindUseInfoController }