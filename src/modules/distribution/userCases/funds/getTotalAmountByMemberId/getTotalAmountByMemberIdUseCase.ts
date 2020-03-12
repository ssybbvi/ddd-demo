import { UseCase } from '../../../../../shared/core/UseCase'
import { IMemberRepo } from '../../../repos/memberRepo'
import { CreateMemberDTO } from './CreateMemberDTO'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { CreateMemberErrors } from './CreateMemberErrors'
import { Member } from '../../../domain/member'
import { MemberId } from '../../../domain/memberId'
import { UserId } from '../../../../users/domain/userId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { MemberDistributionRelation } from '../../../domain/memberDistributionRelation'
import { FundType } from '../../../domain/fundType'
import { GetTotalAmountByMemberIdDto } from './getTotalAmountByMemberIdDto'
import { IFundRepo } from '../../../repos/iFundRepo'
import { GetTotalAmountByMemberIdDtoResult } from './GetTotalAmountByMemberIdDtoResult'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<GetTotalAmountByMemberIdDtoResult>>

export class GetTotalAmountByMemberIdUseCase implements UseCase<GetTotalAmountByMemberIdDto, Promise<Response>> {
  private fundRepo: IFundRepo

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: GetTotalAmountByMemberIdDto): Promise<Response> {
    const { memberId } = request

    try {
      let memberIdOrErrors = MemberId.create(new UniqueEntityID(memberId))
      if (memberIdOrErrors.isFailure) {
        return left(memberIdOrErrors)
      }

      let fundList = await this.fundRepo.getListByMemberId(memberIdOrErrors.getValue())
      let totalAmount = fundList.reduce((acc, item) => {
        if (item.incomeMemberId == memberIdOrErrors.getValue()) {
          return acc + item.amount.value
        }

        if (
          item.paymentMemberId == memberIdOrErrors.getValue() &&
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
