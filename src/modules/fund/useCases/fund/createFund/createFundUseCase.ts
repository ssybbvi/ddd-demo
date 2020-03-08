import { UseCase } from '../../../../../shared/core/UseCase'
import { CreateFundDto } from './createFundDto'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { CreateFundErrors } from './createFundErrors'
import { IFundRepo } from '../../../repos/iFundRepo'
import { FundAmount } from '../../../domain/fundAmount'
import { Fund } from '../../../domain/fund'
import { MemberId } from '../../../../distribution/domain/memberId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'

type Response = Either<CreateFundErrors.FundAmountError | AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateFundUseCase implements UseCase<CreateFundDto, Promise<Response>> {
  private fundRepo: IFundRepo

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: CreateFundDto): Promise<Response> {
    try {
      const fundAmountOrError = FundAmount.create({
        fundAmount: request.amount
      })

      if (fundAmountOrError.isFailure) {
        return left(new CreateFundErrors.FundAmountError(request.amount))
      }

      const incomeMemberIdOrError = MemberId.create(new UniqueEntityID(request.incomeMemberId))
      if (incomeMemberIdOrError.isFailure) {
        return left(incomeMemberIdOrError)
      }

      const paymentMemberIdOrError = MemberId.create(new UniqueEntityID(request.paymentMemberId))
      if (paymentMemberIdOrError.isFailure) {
        return left(paymentMemberIdOrError)
      }

      let fundOrError = Fund.create({
        amount: fundAmountOrError.getValue(),
        status: request.status,
        incomeMemberId: incomeMemberIdOrError.getValue(),
        paymentMemberId: paymentMemberIdOrError.getValue(),
        createAt: Date.now(),
        descrpiton: request.descrpiton,
        type: request.type,
        relationId: request.relationId
      })

      if (fundOrError.isFailure) {
        return left(fundOrError)
      }

      this.fundRepo.save(fundOrError.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
