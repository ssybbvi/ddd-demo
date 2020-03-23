import { UseCase } from '../../../../../shared/core/UseCase'
import { IAuthorityUserRepo } from '../../../repos/authorityUserRepo'
import { GetAuthorityUserRequestDto } from './getAuthorityUserRequestDto'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { AuthorityUserDetails } from '../../../domain/authorityUserDetails'

type Response = Either<AppError.UnexpectedError, Result<AuthorityUserDetails[]>>

export class GetAuthorityUserListUseCase implements UseCase<GetAuthorityUserRequestDto, Promise<Response>> {
  private authorityUserRepo: IAuthorityUserRepo

  constructor(authorityUserRepo: IAuthorityUserRepo) {
    this.authorityUserRepo = authorityUserRepo
  }

  public async execute(request: GetAuthorityUserRequestDto): Promise<Response> {
    let authorityUserList: AuthorityUserDetails[]

    try {
      authorityUserList = await this.authorityUserRepo.filter()
      return right(Result.ok<AuthorityUserDetails[]>(authorityUserList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
