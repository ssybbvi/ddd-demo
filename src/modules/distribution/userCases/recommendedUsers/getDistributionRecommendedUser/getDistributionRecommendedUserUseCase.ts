import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetDistributionRecommendedUserDto } from './getDistributionRecommendedUserDto'
import { GetDistributionRecommendedUserResult } from './getDistributionRecommendedUserDtoResult'
import { IFundRepo } from '../../../../funds/repos/iFundRepo'
import { FundType } from '../../../../funds/domain/fundType'
import { Team } from '../../../domain/team'

type Response = Either<AppError.UnexpectedError, Result<GetDistributionRecommendedUserResult>>

export class GetDistributionRecommendedUserUseCase
  implements UseCase<GetDistributionRecommendedUserDto, Promise<Response>> {
  private fundRepo: IFundRepo

  constructor(fundRepo: IFundRepo) {
    this.fundRepo = fundRepo
  }

  public async execute(request: GetDistributionRecommendedUserDto): Promise<Response> {
    try {
      const { recommendedUserId } = request

      let primaryDistributionTeams = await this.getTeamDto(recommendedUserId, 'primaryDistribution', 0)

      let primaryDistributionByTodayTeams = await this.getTeamDto(
        recommendedUserId,
        'primaryDistribution',
        new Date().setHours(0, 0, 0, 0)
      )

      let secondaryDistributionTeams = await this.getTeamDto(recommendedUserId, 'secondaryDistribution', 0)

      let secondaryDistributionByTodayTeams = await this.getTeamDto(
        recommendedUserId,
        'secondaryDistribution',
        new Date().setHours(0, 0, 0, 0)
      )

      return right(
        Result.ok<GetDistributionRecommendedUserResult>({
          primaryDistributionTeams,
          primaryDistributionByTodayTeams,
          secondaryDistributionTeams,
          secondaryDistributionByTodayTeams
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }

  private async getTeamDto(recommendedUserId: string, type: FundType, createAt: number): Promise<Team[]> {
    let distributionList = await this.fundRepo.getDistributionList(recommendedUserId, type, createAt)

    let teamDtoList: Team[] = []
    for (let item of distributionList) {
      if (item.paymentUserId == '0') {
        const teamOrError = Team.create({
          userId: item.paymentUserId,
          // nickName: type === 'primaryDistribution' ? '赚赚' : '乐乐',
          // avatarUrl:
          //   type === 'primaryDistribution'
          //     ? 'https://pic2.zhimg.com/v2-8b0006ebf42e8ee2df8ef1d538e74d64_xl.jpg'
          //     : 'https://profile.csdnimg.cn/2/6/3/3_woshidamimi0',
          // gender: 1,
          integral: item.totalAmount
        })
        teamDtoList.push(teamOrError.getValue())
      } else {
        const teamOrError = Team.create({
          userId: item.paymentUserId,
          integral: item.totalAmount
        })
        teamDtoList.push(teamOrError.getValue())
      }
    }

    return teamDtoList
  }
}
