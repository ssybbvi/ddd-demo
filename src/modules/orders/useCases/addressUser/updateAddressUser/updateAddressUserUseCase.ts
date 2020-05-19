import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IAddressUserRepo } from '../../../repos/addressUserRepo'
import { AddressUser } from '../../../domain/addressUser'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { OrderAssertionService } from '../../../domain/service/assertionService'
import { AddressInfo } from '../../../domain/addressInfo'
import { IUpdateAddressUserDto } from './updateAddressUserDto'
import { NotFoundError } from '../../../../../shared/core/NotFoundError'

type Response = Either<AppError.UnexpectedError | Result<AddressUser> | Result<AddressInfo>, Result<void>>

export class UpdateAddressUserUseCase implements UseCase<IUpdateAddressUserDto, Promise<Response>> {
  private addressUserRepo: IAddressUserRepo

  constructor(addressUserRepo: IAddressUserRepo) {
    this.addressUserRepo = addressUserRepo
  }

  public async execute(request: IUpdateAddressUserDto): Promise<Response> {
    try {
      const { _id, userName, provinceName, cityName, countyName, detailAddressInfo, nationalCode, telNumber } = request

      const addressUser = await this.addressUserRepo.getById(_id)
      if (!addressUser) {
        return left(new NotFoundError(`没有此收货地址`))
      }

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

      addressUser.updateAddressInfo(addressInfoOrErrors.getValue())

      await this.addressUserRepo.save(addressUser)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
