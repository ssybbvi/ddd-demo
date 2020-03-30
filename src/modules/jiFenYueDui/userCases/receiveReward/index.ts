import { ReceiveRewardController } from "./receiveRewardController";
import { ReceiveRewardUseCase } from "./receiveRewardUseCase";
import { dayDayTaskRepo } from "../../repos";


const receiveRewardUseCase = new ReceiveRewardUseCase(dayDayTaskRepo)
const receiveRewardController = new ReceiveRewardController(receiveRewardUseCase)

export { receiveRewardUseCase, receiveRewardController }