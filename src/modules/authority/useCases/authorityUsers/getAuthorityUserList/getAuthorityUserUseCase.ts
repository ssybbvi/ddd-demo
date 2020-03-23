import { UseCase } from '../../../../../shared/core/UseCase'
import { IAuthorityUserRepo } from '../../../repos/authorityUserRepo'
import { GetAuthorityUserRequestDto } from './getAuthorityUserRequestDto'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { AuthorityUserDetails } from '../../../domain/authorityUserDetails'
import { AuthorityUser } from '../../../domain/authorityUser'

type Response = Either<AppError.UnexpectedError, Result<AuthorityUser[]>>

export class GetAuthorityUserListUseCase implements UseCase<GetAuthorityUserRequestDto, Promise<Response>> {
  private authorityUserRepo: IAuthorityUserRepo

  constructor(authorityUserRepo: IAuthorityUserRepo) {
    this.authorityUserRepo = authorityUserRepo
  }

  public async execute(request: GetAuthorityUserRequestDto): Promise<Response> {
    let authorityUserList: AuthorityUser[]

    try {
      authorityUserList = await this.authorityUserRepo.filter()
      return right(Result.ok<AuthorityUser[]>(authorityUserList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
