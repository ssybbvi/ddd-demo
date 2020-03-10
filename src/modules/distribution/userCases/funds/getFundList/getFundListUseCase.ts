import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IMemberRepo } from '../../../repos/memberRepo'
import { IFundRepo } from '../../../repos/iFundRepo'
import { MemberId } from '../../../domain/memberId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import e = require('express')
import { TermDTO } from '../../../dtos/termDTO'
import { FundType } from '../../../domain/fundType'
import { GetFundListDto } from './getFundListDto'
import { FundDto } from '../../../dtos/fundDto'
import { Fund } from '../../../domain/fund'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<Fund[]>>

export class GetFundListUseCase implements UseCase<GetFundListDto, Promise<Response>> {
  private fundRepo: IFundRepo

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: GetFundListDto): Promise<Response> {
    try {
      const { memberId } = request
      let memberIdOrError = MemberId.create(new UniqueEntityID(request.memberId))
      if (memberIdOrError.isFailure) {
        return left(memberIdOrError)
      }
      let fundList = await this.fundRepo.getListByMemberId(memberIdOrError.getValue())
      return right(Result.ok<Fund[]>(fundList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
