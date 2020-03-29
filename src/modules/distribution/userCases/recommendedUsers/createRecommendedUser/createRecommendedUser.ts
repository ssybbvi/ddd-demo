import { UseCase } from '../../../../../shared/core/UseCase'
import { IRecommendedUserRepo } from '../../../repos/recommendedUserRepo'
import { CreateRecommendedUserDTO } from './CreateRecommendedUserDTO'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { CreateRecommendedUserErrors } from './CreateRecommendedUserErrors'
import { RecommendedUser } from '../../../domain/recommendedUser'
import { RecommendedUserId } from '../../../domain/recommendedUserId'
import { UserId } from '../../../../users/domain/userId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { FundType } from '../../../../funds/domain/fundType'

type Response = Either<
  | CreateRecommendedUserErrors.RecommendedUserAlreadyExistsError
  | CreateRecommendedUserErrors.UserDoesntExistError
  | CreateRecommendedUserErrors.InviteRecommendedUserNotExists
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>

export class CreateRecommendedUser implements UseCase<CreateRecommendedUserDTO, Promise<Response>> {
  private recommendedUserRepo: IRecommendedUserRepo

  constructor(recommendedUserRepo: IRecommendedUserRepo) {
    this.recommendedUserRepo = recommendedUserRepo
  }

  public async execute(request: CreateRecommendedUserDTO): Promise<Response> {
    const { userId, inviteToken } = request

    try {
      let recommendedUserExists = await this.recommendedUserRepo.existsById(userId)
      if (recommendedUserExists) {
        return left(new CreateRecommendedUserErrors.RecommendedUserAlreadyExistsError(userId))
      }

      let inviteRecommendedUserId: string = null //inviteToken //TODO
      if (!!inviteToken) {
        let inviteRecommendedUserExists = await this.recommendedUserRepo.existsByInviteToken(inviteToken)
        // if (!inviteRecommendedUserExists) {
        //   return left(new CreateRecommendedUserErrors.InviteRecommendedUserNotExists(request.inviteToken))
        // }

        if (inviteRecommendedUserExists) {
          let inviteRecommendedUser = await this.recommendedUserRepo.getByInviteToken(inviteToken)
          inviteRecommendedUserId = inviteRecommendedUser.recommendedUserId.id.toString()
        } else {
          console.log(`找不到邀请人:${inviteToken}`)
        }
      }

      const recommendedUserOrError: Result<RecommendedUser> = RecommendedUser.create(
        {
          distributionRelationList: []
        },
        new UniqueEntityID(userId),
        true
      )

      if (recommendedUserOrError.isFailure) {
        return left(recommendedUserOrError)
      }

      let recommendedUser = recommendedUserOrError.getValue()

      await this.recommendedUserRepo.save(recommendedUser)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
