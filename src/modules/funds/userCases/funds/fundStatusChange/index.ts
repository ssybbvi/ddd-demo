import { FundStatusChangeUseCase } from "./fundStatusChangeUseCase";
import { fundRepo } from "../../../repos";

const fundStatusChangeUseCase = new FundStatusChangeUseCase(fundRepo)

export { fundStatusChangeUseCase }