import { InviteBargainUseCase } from "./inviteBargainUseCase";
import { bargainRepo } from "../../../repos";
import { InviteBargainController } from "./inviteBargainController";


const inviteBargainUseCase = new InviteBargainUseCase(bargainRepo)
const inviteBargainController = new InviteBargainController(inviteBargainUseCase)

export { inviteBargainUseCase, inviteBargainController }