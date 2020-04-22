import { InviteBargainOrderUseCase } from "./inviteBargainOrderUseCase";
import { bargainOrderRepo } from "../../../repos";
import { InviteBargainOrderController } from "./inviteBargainOrderController";


const inviteBargainOrderUseCase = new InviteBargainOrderUseCase(bargainOrderRepo)
const inviteBargainOrderController = new InviteBargainOrderController(inviteBargainOrderUseCase)

export { inviteBargainOrderUseCase, inviteBargainOrderController }