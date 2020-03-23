import { UseCase } from '../../../../../shared/core/UseCase'
import { IAuthorityUserRepo } from '../../../repos/authorityUserRepo'
import { CreateAuthorityUserDTO } from './CreateAuthorityUserDTO'
import { IUserRepo } from '../../../../users/repos/userRepo'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { CreateAuthorityUserErrors } from './CreateAuthorityUserErrors'
import { AuthorityUser } from '../../../domain/authorityUser'

type Response = Either<
  | CreateAuthorityUserErrors.AuthorityUserAlreadyExistsError
  | CreateAuthorityUserErrors.UserDoesntExistError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>

export class CreateAuthorityUser implements UseCase<CreateAuthorityUserDTO, Promise<Response>> {
  private authorityUserRepo: IAuthorityUserRepo
  private userRepo: IUserRepo

  constructor(userRepo: IUserRepo, authorityUserRepo: IAuthorityUserRepo) {
    this.userRepo = userRepo
    this.authorityUserRepo = authorityUserRepo
  }

  public async execute(request: CreateAuthorityUserDTO): Promise<Response> {
    let authorityUser: AuthorityUser

    try {

      const authorityUserOrError: Result<AuthorityUser> = AuthorityUser.create({
        name: request.name,
        roleIds:[]
      })

      if (authorityUserOrError.isFailure) {
        return left(authorityUserOrError)
      }

      authorityUser = authorityUserOrError.getValue()

      await this.authorityUserRepo.save(authorityUser)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
