import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { FundType } from '../../funds/domain/fundType'

export interface IMemberDistributionRelationProps {
  memberId: string
  fundType: FundType
  distributionRate: number
}

export class MemberDistributionRelation extends ValueObject<IMemberDistributionRelationProps> {
  private constructor(prop: IMemberDistributionRelationProps) {
    super(prop)
  }

  get memberId():string{
    return this.props.memberId
  }

  get fundType():FundType{
    return this.props.fundType
  }

  get distributionRate():number{
    return this.props.distributionRate
  }

  get value(): IMemberDistributionRelationProps {
    return this.props
  }

  public static create(props: IMemberDistributionRelationProps): Result<MemberDistributionRelation> {
    return Result.ok<MemberDistributionRelation>(new MemberDistributionRelation(props))
  }
}
