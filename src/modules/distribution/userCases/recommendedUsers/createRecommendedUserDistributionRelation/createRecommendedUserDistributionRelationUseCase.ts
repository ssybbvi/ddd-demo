import { UseCase } from '../../../../../shared/core/UseCase'
import { IRecommendedUserRepo } from '../../../repos/recommendedUserRepo'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { RecommendedUserDistributionRelation } from '../../../domain/recommendedUserDistributionRelation'
import { FundType } from '../../../../funds/domain/fundType'
import { CreateRecommendedUserDistributionRelationDto } from './createRecommendedUserDistributionRelationDto'
import { CreateRecommendedUserErrors } from '../createRecommendedUser/CreateRecommendedUserErrors'
import { IUserRepo } from '../../../../users/repos/userRepo'

type Response = Either<
  CreateRecommendedUserErrors.RecommendedUserAlreadyExistsError | AppError.UnexpectedError | Result<any>,
  Result<void>
>

type CreateRecommendedUserDistributionRelationResponse = Either<
  AppError.UnexpectedError | Result<any>,
  Result<RecommendedUserDistributionRelation[]>
>

interface inviteDistributionRewardRelation {
  distributionRate: number
  fundType: FundType
}

export class CreateRecommendedUserDistributionRelationUseCase
  implements UseCase<CreateRecommendedUserDistributionRelationDto, Promise<Response>> {
  private recommendedUserRepo: IRecommendedUserRepo
  private userRepo: IUserRepo
  private inviteDistributionRewardRelationList: inviteDistributionRewardRelation[] = [
    {
      distributionRate: 0.1,
      fundType: 'primaryDistribution'
    },
    {
      distributionRate: 0.05,
      fundType: 'secondaryDistribution'
    }
  ]

  constructor(recommendedUserRepo: IRecommendedUserRepo, userRepo: IUserRepo) {
    this.recommendedUserRepo = recommendedUserRepo
    this.userRepo = userRepo
  }

  public async execute(request: CreateRecommendedUserDistributionRelationDto): Promise<Response> {
    const { recommendedUserId } = request
    try {
      let recommendedUser = await this.recommendedUserRepo.getById(recommendedUserId)

      let inviteDistributionRewardRelationListTemp = JSON.parse(
        JSON.stringify(this.inviteDistributionRewardRelationList)
      )
      let createRecommendedUserDistributionRelationResponse = await this.createRecommendedUserDistributionRelation(
        recommendedUser.recommendedUserId.id.toString(),
        inviteDistributionRewardRelationListTemp,
        []
      )

      let createRecommendedUserDistributionRelationResponseValue =
        createRecommendedUserDistributionRelationResponse.value
      if (createRecommendedUserDistributionRelationResponse.isLeft()) {
        return left(createRecommendedUserDistributionRelationResponseValue)
      }

      recommendedUser.updateDistributionRelationList(createRecommendedUserDistributionRelationResponseValue.getValue())
      await this.recommendedUserRepo.save(recommendedUser)

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
    let existRecommendedUser = await this.recommendedUserRepo.existsById(recommendedUserId)
    if (!existRecommendedUser) {
      return right(Result.ok<RecommendedUserDistributionRelation[]>(recommendedUserDistributionRelationList))
    }
    let user = await this.userRepo.getById(recommendedUserId)

    if (!!user.inviteRecommendedUserId && !!inviteDistributionRewardRelationList.length) {
      let inviteDistributionRewardRelation = inviteDistributionRewardRelationList.shift()

      let recommendedUserDistributionRelationOrErrors = RecommendedUserDistributionRelation.create({
        recommendedUserId: user.inviteRecommendedUserId,
        distributionRate: inviteDistributionRewardRelation.distributionRate,
        fundType: inviteDistributionRewardRelation.fundType
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
