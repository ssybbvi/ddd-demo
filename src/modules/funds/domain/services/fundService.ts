import { Result, Either, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { Fund } from '../fund'
import { FundAmount } from '../fundAmount'
import { GetMemberUseCase } from '../../../distribution/userCases/members/getMember/getMemberUseCase'
import { Member } from '../../../distribution/domain/member'
import { CreateFundUseCase } from '../../userCases/funds/createFund/createFundUseCase'


type MemberResponse=Either<AppError.UnexpectedError | Result<any>, Result<Member>>
type FundListResponse=Either<AppError.UnexpectedError | Result<any>, Result<Fund[]>>
type DistributionResponse=Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class FundService {

  private getMemberUseCase: GetMemberUseCase
  private createFundUseCase:CreateFundUseCase
   
  constructor(
    getMemberUseCase: GetMemberUseCase,
    createFundUseCase:CreateFundUseCase
    ) {
    this.getMemberUseCase = getMemberUseCase
    this.createFundUseCase = createFundUseCase
  }

  public async distribution( fund:Fund ):Promise<DistributionResponse>{
    const getMemberUseCaseResult = await this.getMemberUseCase.execute({memberId:fund.incomeMemberId})
    const  getMemberUseCaseResultValue=getMemberUseCaseResult.value
    if(getMemberUseCaseResult.isLeft()){
      return left(getMemberUseCaseResult)
    }
    const member=getMemberUseCaseResultValue.getValue() as Member

    
    let fundList:Fund[]=[fund]
    for (let item of member.distributionRelationList) {
      const fundAmountOrError = FundAmount.create({
        fundAmount: Math.ceil(fund.amount.value * item.distributionRate)
      })

      if (fundAmountOrError.isFailure) {
        return left(fundAmountOrError)
      }

      const fundOrErrors=Fund.create({
        amount: fundAmountOrError.getValue(),
        incomeMemberId: item.memberId,
        paymentMemberId: fund.incomeMemberId,
        type: item.fundType,
        relationId: fund.relationId
      })

      if (fundOrErrors.isFailure) {
        return left(fundOrErrors)
      }
      fundList.push(fundOrErrors.getValue())
    }


    for(const item of fundList){
      const createFundUseCaseResult=  await this.createFundUseCase.execute({
        amount: item.amount.value,
        incomeMemberId: item.incomeMemberId,
        paymentMemberId: item.paymentMemberId,
        status: item.status,
        descrption: item.descrption,
        type: item.type,
        relationId: item.relationId,
      })
      if(createFundUseCaseResult.isLeft()){
        return left(createFundUseCaseResult.value)
      }
    }
   
    return right(Result.ok<void>())
  }
}
