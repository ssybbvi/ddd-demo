import { SignIn } from '../signIn'
import { GetMemberDto } from '../../userCases/members/getMember/getMemberDto'
import {
  DistributionRelationDto,
  DistributionFundDto
} from '../../userCases/funds/distributionFund/distributionFundDto'
import { FundType } from '../fundType'
import { DistributionFundUseCase } from '../../userCases/funds/distributionFund/distributionFundUseCase'
import { GetMemberUseCase } from '../../userCases/members/getMember/getMemberUseCase'
import { Result, Either, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class FundService {
  private distributionFundUseCase: DistributionFundUseCase
  private getMemberUseCase: GetMemberUseCase

  constructor(distributionFundUseCase: DistributionFundUseCase, getMemberUseCase: GetMemberUseCase) {
    this.distributionFundUseCase = distributionFundUseCase
    this.getMemberUseCase = getMemberUseCase
  }

  public async signInRewared(signIn: SignIn, fundType: FundType): Promise<Response> {
    let getMemberDto: GetMemberDto = { memberId: signIn.memberId }
    let memberDtoResult = await this.getMemberUseCase.execute(getMemberDto)
    let memberDtoResultValue = memberDtoResult.value
    if (memberDtoResult.isLeft()) {
      return left(memberDtoResultValue)
    }

    let distributionRelationDtoList: DistributionRelationDto[] = memberDtoResultValue
      .getValue()
      .distributionRelationList.map(item => {
        return {
          memberId: item.memberId,
          distributionRate: item.distributionRate,
          fundType: item.fundType
        }
      })
    let distributionFundDto: DistributionFundDto = {
      memberId: getMemberDto.memberId,
      amount: signIn.reward,
      fundType: fundType,
      relationId: signIn.id.toString(),
      distributionRelationList: distributionRelationDtoList
    }
    await this.distributionFundUseCase.execute(distributionFundDto)

    return right(Result.ok<void>())
  }
}
