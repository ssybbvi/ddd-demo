import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { FundType } from './fundType'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'

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
