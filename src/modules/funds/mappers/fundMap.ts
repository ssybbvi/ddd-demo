import { IMapper } from '../../../shared/infra/Mapper'
import { Fund } from '../domain/fund'
import { FundDto } from '../dtos/fundDto'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IFundDbModel } from '../dbModels/iFundDbModel'
import { FundAmount } from '../domain/fundAmount'
import { FundType } from '../domain/fundType'
import { FundStatus } from '../domain/fundStatus'

export class FundMap implements IMapper<Fund> {
  public static toDTO(fund: Fund): FundDto {
    return {
      _id: fund.fundId.id.toString(),
      amount: fund.amount.value,
      createAt: fund.createAt,
      descrpiton: fund.description,
      type: fund.type
    }
  }

  public static toDomain(raw: IFundDbModel): Fund {
    if (raw === null) {
      return null
    }
    const fundAmountOrError = FundAmount.create({ fundAmount: raw.amount })

    const fundOrError = Fund.create(
      {
        amount: fundAmountOrError.getValue(),
        status: raw.status as FundStatus,
        incomeUserId: raw.incomeUserId,
        paymentUserId: raw.paymentUserId,
        createAt: raw.createAt,
        descrpiton: raw.descrpiton,
        type: raw.type as FundType,
        relationId: raw.relationId
      },
      new UniqueEntityID(raw._id)
    )

    fundOrError.isFailure ? console.log(fundOrError.error) : ''
    return fundOrError.isSuccess ? fundOrError.getValue() : null
  }

  public static async toPersistence(fund: Fund): Promise<IFundDbModel> {
    return {
      _id: fund.id.toString(),
      amount: fund.amount.value,
      incomeUserId: fund.incomeUserId,
      paymentUserId: fund.paymentUserId,
      status: fund.status,
      createAt: fund.createAt,
      descrpiton: fund.description,
      type: fund.type,
      relationId: fund.relationId
    }
  }
}
