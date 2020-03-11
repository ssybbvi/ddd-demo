import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { MemberId } from '../domain/memberId'
import { FundAccount } from '../domain/fundAccount'
import { FundAccountDto } from '../dtos/fundAccountDto'
import { IFundAccountDbModel } from '../dbModels/iFundAccountDbModel'

export class FundAccountMap implements IMapper<FundAccount> {
  public static toDTO(fundAccount: FundAccount): FundAccountDto {
    return {
      totalAmount: fundAccount.totalAmounnt
    }
  }

  public static toDomain(raw: IFundAccountDbModel): FundAccount {
    const fundAccountOrError = FundAccount.create(
      {
        totalAmounnt: raw.totalAmount
      },
      new UniqueEntityID(raw._id)
    )

    fundAccountOrError.isFailure ? console.log(fundAccountOrError.error) : ''
    return fundAccountOrError.isSuccess ? fundAccountOrError.getValue() : null
  }

  public static toPersistence(fundAccount: FundAccount): IFundAccountDbModel {
    return {
      _id: fundAccount.id.toString(),
      totalAmount: fundAccount.totalAmounnt
    }
  }
}
