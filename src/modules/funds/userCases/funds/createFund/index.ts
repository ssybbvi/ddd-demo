import { CreateFundUseCase } from "./createFundUseCase";
import { fundRepo } from "../../../repos";

const createFundUseCase=new CreateFundUseCase(fundRepo)
export{ createFundUseCase} 