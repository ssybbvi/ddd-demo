import { AfterRecommendedUserCreated } from "./afterRecommendedUserCreated";
import { getUserByInviteRecommendedUserIdUseCase } from "../../distribution/userCases/recommendedUsers/getUserByInviteRecommendedUserId";
import { completeTaskUseCase } from "../userCases/completeTask";
import { AfterUserCreated } from "./afterUserCreated";


new AfterUserCreated(completeTaskUseCase)
new AfterRecommendedUserCreated(getUserByInviteRecommendedUserIdUseCase, completeTaskUseCase)