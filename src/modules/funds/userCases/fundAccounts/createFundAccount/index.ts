import { CreateFundAccountUseCase } from "./createFundAccountUseCase";
import {   fundAccountRepo } from "../../../repos";


const createFundAccountUseCase=new CreateFundAccountUseCase(fundAccountRepo)

export{  createFundAccountUseCase}