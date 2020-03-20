import { IHandle } from '../../../shared/domain/events/IHandle'
import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
import { FundService } from '../domain/services/fundService'
import { SignInCreated } from '../../distribution/domain/events/signInCreated'
import { Fund } from '../domain/fund'
import { FundAmount } from '../domain/fundAmount'

export class AfterSignInCreated implements IHandle<SignInCreated> {

  private fundService:FundService
 
  constructor(
    fundService:FundService
    ) {
    this.setupSubscriptions()
    this.fundService=fundService
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onAfterSignInCreated.bind(this), SignInCreated.name)
  }

  private async onAfterSignInCreated(event: SignInCreated): Promise<void> {
    const { signIn } = event

    try {
      const fundAmountOrError = FundAmount.create({
        fundAmount: signIn.reward
      })
      if (fundAmountOrError.isFailure) {
        console.error(fundAmountOrError.error)
        return 
      }
      const fundOrErrors= Fund.create({
        incomeMemberId:signIn.memberId,
        amount: fundAmountOrError.getValue(),
        type: 'signIn',
        relationId: signIn.id.toString()
      })

      const distributionResult=await  this.fundService.distribution(fundOrErrors.getValue())
      if(distributionResult.isLeft()){
        console.error(distributionResult.value)
        return
      }

      console.log(`[AfterSignInCreated]: Successfully executed CreateMember use case AfterSignInCreated`)
    } catch (err) {
      console.log(`[AfterSignInCreated]: Failed to execute CreateMember use case AfterSignInCreated.`)
    }
  }

}
