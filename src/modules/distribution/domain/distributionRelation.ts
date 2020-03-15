import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { FundType } from '../../funds/domain/fundType'

export interface IDistributionRelationProps {
  memberId: string
  fundType: FundType
  distributionRate: number
}

export class DistributionRelation extends AggregateRoot<IDistributionRelationProps> {
  private constructor(props: IDistributionRelationProps, id?: UniqueEntityID) {
    super(props, id)
  }
}
