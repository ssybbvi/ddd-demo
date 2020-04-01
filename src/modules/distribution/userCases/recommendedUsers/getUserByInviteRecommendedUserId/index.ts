import { GetUserByInviteRecommendedUserIdUseCase } from "./getUserByInviteRecommendedUserIdUseCase";
import { recommendedUserRepo } from "../../../repos";

const getUserByInviteRecommendedUserIdUseCase = new GetUserByInviteRecommendedUserIdUseCase(recommendedUserRepo)

export { getUserByInviteRecommendedUserIdUseCase }