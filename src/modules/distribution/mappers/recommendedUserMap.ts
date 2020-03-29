import { IMapper } from '../../../shared/infra/Mapper'
import { RecommendedUser } from '../domain/recommendedUser'
import { RecommendedUserDTO } from '../dtos/recommendedUserDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IRecommendedUserDbModel } from '../dbModels/iRecommendedUserDbModel'
import { RecommendedUserDistributionRelation } from '../domain/recommendedUserDistributionRelation'

export class RecommendedUserMap implements IMapper<RecommendedUser> {
  public static toDomain(raw: IRecommendedUserDbModel): RecommendedUser {
    let distributionRelationList = raw.distributionRelationList.map(item => {
      let recommendedUserDistributionRelationOrErrors = RecommendedUserDistributionRelation.create({
        recommendedUserId: item.recommendedUserId,
        distributionRate: item.distributionRate,
        fundType: item.fundType
      })
      return recommendedUserDistributionRelationOrErrors.getValue()
    })

    const recommendedUserOrError = RecommendedUser.create(
      {
        distributionRelationList: distributionRelationList
      },
      new UniqueEntityID(raw._id)
    )

    recommendedUserOrError.isFailure ? console.log(recommendedUserOrError.error) : ''

    return recommendedUserOrError.isSuccess ? recommendedUserOrError.getValue() : null
  }

  public static toPersistence(recommendedUser: RecommendedUser): IRecommendedUserDbModel {
    let distributionRelationList = recommendedUser.distributionRelationList.map(item => {
      return {
        recommendedUserId: item.props.recommendedUserId,
        distributionRate: item.props.distributionRate,
        fundType: item.props.fundType
      }
    })

    return {
      _id: recommendedUser.id.toString(),
      distributionRelationList: distributionRelationList
    }
  }

  public static toDTO(recommendedUser: RecommendedUser): RecommendedUserDTO {
    let distributionRelationList = recommendedUser.distributionRelationList.map(item => {
      return {
        recommendedUserId: item.props.recommendedUserId,
        distributionRate: item.props.distributionRate,
        fundType: item.props.fundType
      }
    })

    return {
      _id: recommendedUser.id.toString(),
      distributionRelationList: distributionRelationList
    }
  }
}
