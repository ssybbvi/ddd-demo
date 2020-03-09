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
      if (request.termType === 'primaryDistribution' || request.termType === 'secondaryDistribution') {
      } else {
        return left(new AppError.UnexpectedError('termType只能是primaryDistribution或secondaryDistribution'))
      }

      let memberIdOrError = MemberId.create(new UniqueEntityID(request.memberId))
      if (memberIdOrError.isFailure) {
        return left(memberIdOrError)
      }

      let memberList = await this.memberRepo.getTermMemberList([memberIdOrError.getValue()])
      if (request.termType === 'secondaryDistribution') {
        memberList = await this.memberRepo.getTermMemberList(memberList)
      }

      let todayByMemberDtoList = await this.fundRepo.getTodayByMemberList(
        memberIdOrError.getValue(),
        memberList,
        'primaryDistribution'
      )
      if (!!request.offset) {
        todayByMemberDtoList.slice(0, request.offset)
      }

      let result = todayByMemberDtoList.map(item => {
        return {
          avatar: 'avatar',
          nickName: item.paymentMemberId,
          integral: item.totalAmount
        }
      })

      return right(
        Result.ok<GetDistributionMemberDtoResult>({
          terms: result
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
