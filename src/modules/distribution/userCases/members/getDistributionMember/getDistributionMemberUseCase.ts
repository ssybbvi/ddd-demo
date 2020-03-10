import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetDistributionMemberDto } from './getDistributionMemberDto'
import { GetDistributionMemberDtoResult } from './getDistributionMemberDtoResult'
import { IMemberRepo } from '../../../repos/memberRepo'
import { IFundRepo } from '../../../repos/iFundRepo'
import { MemberId } from '../../../domain/memberId'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import e = require('express')
import { TermDTO } from '../../../dtos/termDTO'
import { FundType } from '../../../domain/fundType'

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
      let memberIdOrError = MemberId.create(new UniqueEntityID(request.memberId))
      if (memberIdOrError.isFailure) {
        return left(memberIdOrError)
      }

      let primaryDistributionTerms = await this.getTermDto(memberIdOrError.getValue(), 'primaryDistribution', 0)

      let primaryDistributionByTodayTerms = await this.getTermDto(
        memberIdOrError.getValue(),
        'primaryDistribution',
        new Date().setHours(0, 0, 0, 0)
      )

      let secondaryDistributionTerms = await this.getTermDto(memberIdOrError.getValue(), 'secondaryDistribution', 0)

      let secondaryDistributionByTodayTerms = await this.getTermDto(
        memberIdOrError.getValue(),
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

  private async getTermDto(memberId: MemberId, type: FundType, createAt: number): Promise<TermDTO[]> {
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
