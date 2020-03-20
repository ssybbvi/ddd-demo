import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetDistributionMemberDto } from './getDistributionMemberDto'
import { GetDistributionMemberDtoResult } from './getDistributionMemberDtoResult'
import { TermDTO } from '../../../dtos/termDTO'
import { IFundRepo } from '../../../../funds/repos/iFundRepo'
import { FundType } from '../../../../funds/domain/fundType'
import { IUserRepo } from '../../../../users/repos/userRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<GetDistributionMemberDtoResult>>

export class GetDistributionMemberUseCase implements UseCase<GetDistributionMemberDto, Promise<Response>> {
  private fundRepo: IFundRepo
  private userRepo: IUserRepo

  constructor(fundRepo: IFundRepo, userRepo: IUserRepo) {
    this.fundRepo = fundRepo
    this.userRepo = userRepo
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
    let distributionList = await this.fundRepo.getDistributionList(memberId, type, createAt)

    let termDtoList: TermDTO[] = []
    for (let item of distributionList) {
      if(item.paymentMemberId=="0"){
        termDtoList.push({
          memberId: item.paymentMemberId,
          nickName: type==="primaryDistribution"?"赚赚":"乐乐",
          avatarUrl:  type==="primaryDistribution"?"https://pic2.zhimg.com/v2-8b0006ebf42e8ee2df8ef1d538e74d64_xl.jpg":"https://profile.csdnimg.cn/2/6/3/3_woshidamimi0",
          gender: 1,
          integral: item.totalAmount
        })
      }else{
        let user = await this.userRepo.getById(item.paymentMemberId)
        termDtoList.push({
          memberId: item.paymentMemberId,
          nickName: user.platform.wx ? user.platform.wx.value.nickName : '',
          avatarUrl: user.platform.wx ? user.platform.wx.value.avatarUrl : '',
          gender: user.platform.wx ? user.platform.wx.value.gender : 1,
          integral: item.totalAmount
        })
      }
    }

 
    return termDtoList
  }
}
