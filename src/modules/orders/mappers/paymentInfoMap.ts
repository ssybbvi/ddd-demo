import { IMapper } from '../../../shared/infra/Mapper'
import { PaymentInfo } from '../domain/paymentInfo'
import { IPaymentInfoDbModel } from '../dbModels/paymentInfoDbModel'
import { IPaymentInfoDto } from '../dtos/paymentInfoDto'



export class PaymentInfoMap implements IMapper<PaymentInfo> {
  public static toDomain(raw: IPaymentInfoDbModel): PaymentInfo {
    if (!raw) {
      return null
    }

    const paymentInfoInfoOrError = PaymentInfo.create(
      {
        amount: raw.amount,
        time: raw.time,
        remark: raw.remark,
      }
    )
    paymentInfoInfoOrError.isFailure ? console.log(paymentInfoInfoOrError.error) : ''
    return paymentInfoInfoOrError.isSuccess ? paymentInfoInfoOrError.getValue() : null
  }

  public static toPersistence(paymentInfoInfo: PaymentInfo): IPaymentInfoDbModel {
    if (!paymentInfoInfo) {
      return null
    }
    return {
      amount: paymentInfoInfo.amount,
      time: paymentInfoInfo.time,
      remark: paymentInfoInfo.remark
    }
  }

  public static toDTO(paymentInfoInfo: PaymentInfo): IPaymentInfoDto {
    if (!paymentInfoInfo) {
      return null
    }
    return {
      amount: paymentInfoInfo.amount,
      time: paymentInfoInfo.time,
      remark: paymentInfoInfo.remark
    }
  }
}
