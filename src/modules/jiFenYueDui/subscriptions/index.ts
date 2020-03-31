import { AfterRecommendedUserCreated } from "./afterRecommendedUserCreated";
import { getUserByInviteRecommendedUserIdUseCase } from "../../distribution/userCases/recommendedUsers/getUserByInviteRecommendedUserId";
import { completeTaskUseCase } from "../userCases/completeTask";


new AfterRecommendedUserCreated(getUserByInviteRecommendedUserIdUseCase, completeTaskUseCase)