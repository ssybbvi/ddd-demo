import { Either, Result, left, right } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { CreateRobotUserDto } from './craeteRobotUserDto'
import { CreateRobotUserDtoResult } from './createRobotUserDtoResult'
import { CreateMemberErrors } from '../../../distribution/userCases/members/createMember/CreateMemberErrors'
import { IUserRepo } from '../../repos/userRepo'
import { User } from '../../domain/user'

type Response = Either<
  AppError.UnexpectedError | CreateMemberErrors.InviteMemberNotExists | Result<any>,
  Result<CreateRobotUserDtoResult>
>

export class CreateRobotUserCase implements UseCase<CreateRobotUserDto, Promise<Response>> {
  private userRepo: IUserRepo

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo
  }

  public async execute(request: CreateRobotUserDto): Promise<Response> {
    try {
      const { inviteToken } = request

      const userOrError = User.create(
        {
          from: 'robot',
          platform: {}
        },
        null,
        {
          inviteToken: inviteToken
        }
      )

      if (userOrError.isFailure) {
        return left(userOrError)
      }

      let user = userOrError.getValue()

      await this.userRepo.save(user)

      return right(
        Result.ok<CreateRobotUserDtoResult>({
          userId: userOrError.getValue().id.toString()
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
