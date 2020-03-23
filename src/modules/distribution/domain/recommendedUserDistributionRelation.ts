import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { FundType } from '../../funds/domain/fundType'

export interface IRecommendedUserDistributionRelationProps {
  recommendedUserId: string
  fundType: FundType
  distributionRate: number
}

export class RecommendedUserDistributionRelation extends ValueObject<IRecommendedUserDistributionRelationProps> {
  private constructor(prop: IRecommendedUserDistributionRelationProps) {
    super(prop)
  }

  get recommendedUserId():string{
    return this.props.recommendedUserId
  }

  get fundType():FundType{
    return this.props.fundType
  }

  get distributionRate():number{
    return this.props.distributionRate
  }

  get value(): IRecommendedUserDistributionRelationProps {
    return this.props
  }

  public static create(props: IRecommendedUserDistributionRelationProps): Result<RecommendedUserDistributionRelation> {
    return Result.ok<RecommendedUserDistributionRelation>(new RecommendedUserDistributionRelation(props))
  }
}
