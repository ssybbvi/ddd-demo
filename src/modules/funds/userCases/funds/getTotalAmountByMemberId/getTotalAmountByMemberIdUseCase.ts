import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { GetTotalAmountByMemberIdDto } from './getTotalAmountByMemberIdDto'
import { IFundRepo } from '../../../repos/iFundRepo'
import { GetTotalAmountByMemberIdDtoResult } from './getTotalAmountByMemberIdDtoResult'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<GetTotalAmountByMemberIdDtoResult>>

export class GetTotalAmountByMemberIdUseCase implements UseCase<GetTotalAmountByMemberIdDto, Promise<Response>> {
  private fundRepo: IFundRepo

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: GetTotalAmountByMemberIdDto): Promise<Response> {
    const { memberId } = request

    try {
      let fundList = await this.fundRepo.getListByMemberId(memberId)
      let totalAmount = fundList.reduce((acc, item) => {
        if (item.incomeMemberId == memberId) {
          return acc + item.amount.value
        }

        if (
          item.paymentMemberId == memberId &&
          item.type != 'primaryDistribution' &&
          item.type != 'secondaryDistribution'
        ) {
          return acc - item.amount.value
        }
        return acc
      }, 0)

      return right(
        Result.ok<GetTotalAmountByMemberIdDtoResult>({
          totalAmount
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
