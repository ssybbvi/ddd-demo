import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IFundRepo } from '../../../repos/iFundRepo'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import e = require('express')
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
      const { recommendedUserId } = request

      let fundList = await this.fundRepo.getListByRecommendedUserId(recommendedUserId)
      return right(Result.ok<Fund[]>(fundList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
