import { UseCase } from '../../../../../shared/core/UseCase'
import { IRecommendedUserRepo } from '../../../repos/recommendedUserRepo'
import { CreateRecommendedUserDTO } from './CreateRecommendedUserDTO'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { RecommendedUser } from '../../../domain/recommendedUser'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { FundType } from '../../../../funds/domain/fundType'
import { RecommendedUserDistributionRelation } from '../../../domain/recommendedUserDistributionRelation'
import { IUserRepo } from '../../../../users/repos/userRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>
type CreateRecommendedUserDistributionRelationResponse = Either<
  Result<any>,
  Result<RecommendedUserDistributionRelation[]>
>

interface inviteDistributionRewardRelation {
  distributionRate: number
  fundType: FundType
}

export class CreateRecommendedUser implements UseCase<CreateRecommendedUserDTO, Promise<Response>> {
  private recommendedUserRepo: IRecommendedUserRepo
  private userRepo: IUserRepo
  private inviteDistributionRewardRelationList: inviteDistributionRewardRelation[] = [
    {
      distributionRate: 0.1,
      fundType: 'primaryDistribution',
    },
    {
      distributionRate: 0.05,
      fundType: 'secondaryDistribution',
    },
  ]

  constructor(recommendedUserRepo: IRecommendedUserRepo, userRepo: IUserRepo) {
    this.recommendedUserRepo = recommendedUserRepo
    this.userRepo = userRepo
  }

  public async execute(request: CreateRecommendedUserDTO): Promise<Response> {
    const { userId } = request

    try {
      let inviteDistributionRewardRelationListTemp = JSON.parse(
        JSON.stringify(this.inviteDistributionRewardRelationList)
      )
      let createRecommendedUserDistributionRelationResult = await this.createRecommendedUserDistributionRelation(
        userId,
        inviteDistributionRewardRelationListTemp,
        []
      )
      const createRecommendedUserDistributionRelationResultValue = createRecommendedUserDistributionRelationResult.value
      if (createRecommendedUserDistributionRelationResult.isLeft()) {
        return left(createRecommendedUserDistributionRelationResult.value)
      }
      const distributionRelationList = createRecommendedUserDistributionRelationResultValue.getValue()

      const recommendedUserOrError: Result<RecommendedUser> = RecommendedUser.create(
        {
          distributionRelationList: distributionRelationList,
        },
        new UniqueEntityID(userId),
        true
      )

      if (recommendedUserOrError.isFailure) {
        return left(recommendedUserOrError)
      }

      await this.recommendedUserRepo.save(recommendedUserOrError.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }

  private async createRecommendedUserDistributionRelation(
    recommendedUserId: string,
    inviteDistributionRewardRelationList: inviteDistributionRewardRelation[],
    recommendedUserDistributionRelationList: RecommendedUserDistributionRelation[]
  ): Promise<CreateRecommendedUserDistributionRelationResponse> {
    let user = await this.userRepo.getById(recommendedUserId)

    if (!!user.inviteRecommendedUserId && !!inviteDistributionRewardRelationList.length) {
      let inviteDistributionRewardRelation = inviteDistributionRewardRelationList.shift()

      let recommendedUserDistributionRelationOrErrors = RecommendedUserDistributionRelation.create({
        recommendedUserId: user.inviteRecommendedUserId,
        distributionRate: inviteDistributionRewardRelation.distributionRate,
        fundType: inviteDistributionRewardRelation.fundType,
      })

      if (recommendedUserDistributionRelationOrErrors.isFailure) {
        return left(recommendedUserDistributionRelationOrErrors)
      }

      recommendedUserDistributionRelationList.push(recommendedUserDistributionRelationOrErrors.getValue())

      await this.createRecommendedUserDistributionRelation(
        user.inviteRecommendedUserId,
        inviteDistributionRewardRelationList,
        recommendedUserDistributionRelationList
      )
    }

    return right(Result.ok<RecommendedUserDistributionRelation[]>(recommendedUserDistributionRelationList))
  }
}
