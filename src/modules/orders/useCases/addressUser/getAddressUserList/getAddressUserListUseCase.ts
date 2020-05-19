import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IAddressUserRepo } from '../../../repos/addressUserRepo'
import { AddressUser } from '../../../domain/addressUser'
import { IGetAddressUserListDto } from './getAddressUserListDto'

type Response = Either<AppError.UnexpectedError | Result<AddressUser>, Result<AddressUser[]>>

export class GetAddressUserListUseCase implements UseCase<IGetAddressUserListDto, Promise<Response>> {
  private addressUserRepo: IAddressUserRepo

  constructor(addressUserRepo: IAddressUserRepo) {
    this.addressUserRepo = addressUserRepo
  }

  public async execute(request: IGetAddressUserListDto): Promise<Response> {
    try {
      const { userId } = request

      const addressUserList = await this.addressUserRepo.filter(userId)

      return right(Result.ok<AddressUser[]>(addressUserList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
