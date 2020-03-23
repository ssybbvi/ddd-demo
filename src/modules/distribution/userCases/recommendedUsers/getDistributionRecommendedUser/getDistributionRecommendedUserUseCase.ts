import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetDistributionRecommendedUserDto } from './getDistributionRecommendedUserDto'
import { GetDistributionRecommendedUserDtoResult } from './getDistributionRecommendedUserDtoResult'
import { TermDTO } from '../../../dtos/termDTO'
import { IFundRepo } from '../../../../funds/repos/iFundRepo'
import { FundType } from '../../../../funds/domain/fundType'
import { IUserRepo } from '../../../../users/repos/userRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<GetDistributionRecommendedUserDtoResult>>

export class GetDistributionRecommendedUserUseCase implements UseCase<GetDistributionRecommendedUserDto, Promise<Response>> {
  private fundRepo: IFundRepo
  private userRepo: IUserRepo

  constructor(fundRepo: IFundRepo, userRepo: IUserRepo) {
    this.fundRepo = fundRepo
    this.userRepo = userRepo
  }

  public async execute(request: GetDistributionRecommendedUserDto): Promise<Response> {
    try {
      const { recommendedUserId } = request

      let primaryDistributionTerms = await this.getTermDto(recommendedUserId, 'primaryDistribution', 0)

      let primaryDistributionByTodayTerms = await this.getTermDto(
        recommendedUserId,
        'primaryDistribution',
        new Date().setHours(0, 0, 0, 0)
      )

      let secondaryDistributionTerms = await this.getTermDto(recommendedUserId, 'secondaryDistribution', 0)

      let secondaryDistributionByTodayTerms = await this.getTermDto(
        recommendedUserId,
        'secondaryDistribution',
        new Date().setHours(0, 0, 0, 0)
      )

      return right(
        Result.ok<GetDistributionRecommendedUserDtoResult>({
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

  private async getTermDto(recommendedUserId: string, type: FundType, createAt: number): Promise<TermDTO[]> {
    let distributionList = await this.fundRepo.getDistributionList(recommendedUserId, type, createAt)

    let termDtoList: TermDTO[] = []
    for (let item of distributionList) {
      if(item.paymentUserId=="0"){
        termDtoList.push({
          recommendedUserId: item.paymentUserId,
          nickName: type==="primaryDistribution"?"赚赚":"乐乐",
          avatarUrl:  type==="primaryDistribution"?"https://pic2.zhimg.com/v2-8b0006ebf42e8ee2df8ef1d538e74d64_xl.jpg":"https://profile.csdnimg.cn/2/6/3/3_woshidamimi0",
          gender: 1,
          integral: item.totalAmount
        })
      }else{
        let user = await this.userRepo.getById(item.paymentUserId)
        termDtoList.push({
          recommendedUserId: item.paymentUserId,
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
