import { CompleteTaskController } from "./completeTaskController";
import { CompleteTaskUseCase } from "./completeTaskUseCase";
import { dayDayTaskRepo } from "../../repos";
import { dayDayTaskService } from "../../domain/service";


const completeTaskUseCase = new CompleteTaskUseCase(dayDayTaskRepo, dayDayTaskService)
const completeTaskController = new CompleteTaskController(completeTaskUseCase)

export { completeTaskUseCase, completeTaskController }