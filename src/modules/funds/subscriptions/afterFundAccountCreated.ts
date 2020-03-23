import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundService } from '../domain/services/fundService'
import { Fund } from '../domain/fund'
import { FundAmount } from '../domain/fundAmount'
import { FundAccountCreated } from '../domain/events/fundAccountCreated'
import { CreateFundUseCase } from '../userCases/funds/createFund/createFundUseCase'

export class AfterFundAccountCreated implements IHandle<FundAccountCreated> {

  private createFundUseCase:CreateFundUseCase
 
  constructor(createFundUseCase:CreateFundUseCase  ) {
    this.setupSubscriptions()
    this.createFundUseCase=createFundUseCase
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onAfterFundAccountCreated.bind(this), FundAccountCreated.name)
  }

  private async onAfterFundAccountCreated(event: FundAccountCreated): Promise<void> {
    const { fundAccount } = event

    try {
     
      const createFundUseCaseByPrimaryDistributionResult=await  this.createFundUseCase.execute({ 
        amount: 10,
        incomeUserId: fundAccount.id.toString(),
        type: "primaryDistribution",
        relationId: fundAccount.id.toString()
      })
      if(createFundUseCaseByPrimaryDistributionResult.isLeft()){
        console.error(createFundUseCaseByPrimaryDistributionResult.value)
        return
      }

      const createFundSecondaryDistributionUseCaseResult=await  this.createFundUseCase.execute({ 
        amount: 1,
        incomeUserId: fundAccount.id.toString(),
        type: "secondaryDistribution",
        relationId: fundAccount.id.toString()
      })
      if(createFundSecondaryDistributionUseCaseResult.isLeft()){
        console.error(createFundSecondaryDistributionUseCaseResult.value)
        return
      }

      console.log(`[AfterFundAccountCreated]: Successfully executed CreateFundUseCase use case AfterFundAccountCreated`)
    } catch (err) {
      console.log(`[AfterFundAccountCreated]: Failed to execute CreateFundUseCase use case AfterFundAccountCreated.`)
    }
  }

}
