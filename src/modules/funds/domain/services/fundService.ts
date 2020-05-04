import { Result, Either, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { Fund } from '../fund'
import { FundAmount } from '../fundAmount'
import { GetRecommendedUserUseCase } from '../../../distribution/userCases/recommendedUsers/getRecommendedUser/getRecommendedUserUseCase'
import { RecommendedUser } from '../../../distribution/domain/recommendedUser'
import { CreateFundUseCase } from '../../userCases/funds/createFund/createFundUseCase'

type DistributionResponse = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class FundService {
  private getRecommendedUserUseCase: GetRecommendedUserUseCase
  private createFundUseCase: CreateFundUseCase

  constructor(getRecommendedUserUseCase: GetRecommendedUserUseCase, createFundUseCase: CreateFundUseCase) {
    this.getRecommendedUserUseCase = getRecommendedUserUseCase
    this.createFundUseCase = createFundUseCase
  }

  public async distribution(fund: Fund): Promise<DistributionResponse> {
    const getRecommendedUserUseCaseResult = await this.getRecommendedUserUseCase.execute({
      recommendedUserId: fund.incomeUserId,
    })
    const getRecommendedUserUseCaseResultValue = getRecommendedUserUseCaseResult.value
    if (getRecommendedUserUseCaseResult.isLeft()) {
      return left(getRecommendedUserUseCaseResult.value)
    }
    const recommendedUser = getRecommendedUserUseCaseResultValue.getValue() as RecommendedUser
    const distributionRelationList = recommendedUser ? recommendedUser.distributionRelationList : []

    let fundList: Fund[] = [fund]
    for (let item of distributionRelationList) {
      const fundAmountOrError = FundAmount.create({
        fundAmount: fund.amount.value * item.distributionRate,
      })

      if (fundAmountOrError.isFailure) {
        return left(fundAmountOrError)
      }

      const fundOrErrors = Fund.create({
        amount: fundAmountOrError.getValue(),
        incomeUserId: item.recommendedUserId,
        paymentUserId: fund.incomeUserId,
        type: item.fundType,
        relationId: fund.relationId,
      })

      if (fundOrErrors.isFailure) {
        return left(fundOrErrors)
      }

      fundList.push(fundOrErrors.getValue())
    }

    for (const item of fundList) {
      const createFundUseCaseResult = await this.createFundUseCase.execute({
        amount: item.amount.value,
        incomeUserId: item.incomeUserId,
        paymentUserId: item.paymentUserId,
        status: item.status,
        description: item.description,
        type: item.type,
        relationId: item.relationId,
      })
      if (createFundUseCaseResult.isLeft()) {
        return left(createFundUseCaseResult.value)
      }
    }

    return right(Result.ok<void>())
  }
}
