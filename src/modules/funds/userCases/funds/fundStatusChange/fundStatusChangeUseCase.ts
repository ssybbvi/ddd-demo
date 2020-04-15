import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IFundRepo } from '../../../repos/iFundRepo'
import e = require('express')
import { FundStatusChangeDto } from './fundStatusChangeDto'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class FundStatusChangeUseCase implements UseCase<FundStatusChangeDto, Promise<Response>> {
  private fundRepo: IFundRepo

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: FundStatusChangeDto): Promise<Response> {
    try {
      const { status, type, relationId } = request

      let fund = await this.fundRepo.getByTypeWithRelationId(type, relationId)
      if (!fund) {
        console.log("修改资金流状态，但是没有对应记录getByTypeWithRelationI(type, relationId)", type, relationId)
        return right(Result.ok<void>())
      }
      if (status === "invalid") {
        fund.toInvalid()
      }
      if (status === "valid") {
        fund.toValid()
      }
      if (status === "freeze") {
        fund.toFreeze()
      }
      await this.fundRepo.save(fund)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
