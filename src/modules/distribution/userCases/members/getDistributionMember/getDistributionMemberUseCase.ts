import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetDistributionMemberDto } from './getDistributionMemberDto'
import { GetDistributionMemberDtoResult } from './getDistributionMemberDtoResult'
import { IMemberRepo } from '../../../repos/memberRepo'
import { MemberId } from '../../../domain/memberId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import e = require('express')
import { TermDTO } from '../../../dtos/termDTO'
import { IFundRepo } from '../../../../funds/repos/iFundRepo'
import { FundType } from '../../../../funds/domain/fundType'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<GetDistributionMemberDtoResult>>

export class GetDistributionMemberUseCase implements UseCase<GetDistributionMemberDto, Promise<Response>> {
  private memberRepo: IMemberRepo
  private fundRepo: IFundRepo

  constructor(memberRepo: IMemberRepo, fundRepo: IFundRepo) {
    this.memberRepo = memberRepo
    this.fundRepo = fundRepo
  }

  public async execute(request: GetDistributionMemberDto): Promise<Response> {
    try {
      const { memberId } = request

      let primaryDistributionTerms = await this.getTermDto(memberId, 'primaryDistribution', 0)

      let primaryDistributionByTodayTerms = await this.getTermDto(
        memberId,
        'primaryDistribution',
        new Date().setHours(0, 0, 0, 0)
      )

      let secondaryDistributionTerms = await this.getTermDto(memberId, 'secondaryDistribution', 0)

      let secondaryDistributionByTodayTerms = await this.getTermDto(
        memberId,
        'secondaryDistribution',
        new Date().setHours(0, 0, 0, 0)
      )

      return right(
        Result.ok<GetDistributionMemberDtoResult>({
          primaryDistributionTerms,
          primaryDistributionByTodayTerms,
          secondaryDistributionTerms,
          secondaryDistributionByTodayTerms
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }

  private async getTermDto(memberId: string, type: FundType, createAt: number): Promise<TermDTO[]> {
    let primaryDistributionList = await this.fundRepo.getDistributionList(memberId, type, createAt)
    let primaryDistributionTerms: TermDTO[] = primaryDistributionList.map(item => {
      return {
        memberId: item.paymentMemberId,
        nickName: '',
        avatarUrl: '',
        gender: 1,
        integral: item.totalAmount
      }
    })
    return primaryDistributionTerms
  }
}
