import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IAddressUserRepo } from '../../../repos/addressUserRepo'
import { AddressUser } from '../../../domain/addressUser'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { ICreateAddressUserDto } from './createAddressUserDto'
import { AddressInfo } from '../../../domain/addressInfo'

type Response = Either<AppError.UnexpectedError | Result<AddressUser> | Result<AddressInfo>, Result<void>>

export class CreateAddressUserUseCase implements UseCase<ICreateAddressUserDto, Promise<Response>> {
  private addressUserRepo: IAddressUserRepo

  constructor(addressUserRepo: IAddressUserRepo) {
    this.addressUserRepo = addressUserRepo
  }

  public async execute(request: ICreateAddressUserDto): Promise<Response> {
    try {
      const {
        userId,
        userName,
        provinceName,
        cityName,
        countyName,
        detailAddressInfo,
        nationalCode,
        telNumber,
      } = request

      const addressInfoOrErrors = AddressInfo.create({
        userName: userName,
        provinceName: provinceName,
        cityName: cityName,
        countyName: countyName,
        detailAddressInfo: detailAddressInfo,
        nationalCode: nationalCode,
        telNumber: telNumber,
      })

      if (addressInfoOrErrors.isFailure) {
        return left(addressInfoOrErrors)
      }

      const addressUserOrErrors = AddressUser.create(
        {
          userId,
          addressInfo: addressInfoOrErrors.getValue(),
          isDefault: false,
        },
        new UniqueEntityID(userId)
      )
      if (addressUserOrErrors.isFailure) {
        return left(addressUserOrErrors)
      }

      await this.addressUserRepo.save(addressUserOrErrors.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
