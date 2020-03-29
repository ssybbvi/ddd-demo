import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetDistributionRecommendedUserDto } from './getDistributionRecommendedUserDto'
import { GetDistributionRecommendedUserDtoResult } from './getDistributionRecommendedUserDtoResult'
import { TermDTO } from '../../../dtos/termDTO'
import { IFundRepo } from '../../../../funds/repos/iFundRepo'
import { FundType } from '../../../../funds/domain/fundType'
import { IWxUserRepo } from '../../../../users/repos/wxUserRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<GetDistributionRecommendedUserDtoResult>>

export class GetDistributionRecommendedUserUseCase
  implements UseCase<GetDistributionRecommendedUserDto, Promise<Response>> {
  private fundRepo: IFundRepo
  private wxUserRepo: IWxUserRepo

  constructor(fundRepo: IFundRepo, wxUserRepo: IWxUserRepo) {
    this.fundRepo = fundRepo
    this.wxUserRepo = wxUserRepo
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
      if (item.paymentUserId == '0') {
        termDtoList.push({
          recommendedUserId: item.paymentUserId,
          nickName: type === 'primaryDistribution' ? '赚赚' : '乐乐',
          avatarUrl:
            type === 'primaryDistribution'
              ? 'https://pic2.zhimg.com/v2-8b0006ebf42e8ee2df8ef1d538e74d64_xl.jpg'
              : 'https://profile.csdnimg.cn/2/6/3/3_woshidamimi0',
          gender: 1,
          integral: item.totalAmount
        })
      } else {
        let wxUser = await this.wxUserRepo.getById(item.paymentUserId)
        termDtoList.push({
          recommendedUserId: item.paymentUserId,
          nickName: wxUser.nickName,
          avatarUrl: wxUser.avatarUrl,
          gender: wxUser.gender,
          integral: item.totalAmount
        })
      }
    }

    return termDtoList
  }
}
