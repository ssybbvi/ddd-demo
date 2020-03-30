import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { RecommendedUserCreated } from './events/recommendedUserCreated'
import { RecommendedUserId } from './recommendedUserId'
import { RecommendedUserDistributionRelation } from './recommendedUserDistributionRelation'
import { InviteRecommendedUser } from './events/InviteRecommendedUser'

interface RecommendedUserProps {
  inviteRecommendedUserId?: string
  createAt?: number
  inviteToken: string
  distributionRelationList: RecommendedUserDistributionRelation[]
}

export class RecommendedUser extends AggregateRoot<RecommendedUserProps> {
  private constructor(props: RecommendedUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get recommendedUserId(): RecommendedUserId {
    return RecommendedUserId.create(this._id).getValue()
  }

  get inviteRecommendedUserId(): string {
    return this.props.inviteRecommendedUserId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get inviteToken(): string {
    return this.props.inviteToken
  }

  get distributionRelationList(): RecommendedUserDistributionRelation[] {
    return this.props.distributionRelationList
  }

  public updateDistributionRelationList(recommendedUserDistributionRelationList: RecommendedUserDistributionRelation[]): void {
    this.props.distributionRelationList = recommendedUserDistributionRelationList
  }

  public static create(props: RecommendedUserProps, id?: UniqueEntityID, isAddDomainEvent: boolean = false): Result<RecommendedUser> {
    const defaultValues: RecommendedUserProps = {
      ...props,
      createAt: props.createAt ? props.createAt : Date.now()
    }

    const recommendedUser = new RecommendedUser(defaultValues, id)
    const isNewRecommendedUser = !!id === false

    if (isNewRecommendedUser || isAddDomainEvent) {
      recommendedUser.addDomainEvent(new RecommendedUserCreated(recommendedUser))
    }

    return Result.ok<RecommendedUser>(recommendedUser)
  }
}
