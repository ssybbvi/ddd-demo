import { GetDayDayTaskListController } from "./getDayDayTaskController";
import { GetDayDayTaskListUseCase } from "./getDayDayTaskListUseCase";
import { dayDayTaskRepo } from "../../repos";


const getDayDayTaskListUseCase = new GetDayDayTaskListUseCase(dayDayTaskRepo)
const getDayDayTaskListController = new GetDayDayTaskListController(getDayDayTaskListUseCase)
export { getDayDayTaskListUseCase, getDayDayTaskListController }