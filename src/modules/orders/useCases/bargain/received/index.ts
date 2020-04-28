import { ReceivedUseCase } from "./receivedUseCase"
import { ReceivedController } from "./receivedController"
import { bargainRepo } from "../../../repos"


const receivedUseCase = new ReceivedUseCase(bargainRepo)
const receivedController = new ReceivedController(receivedUseCase)

export { receivedUseCase, receivedController }