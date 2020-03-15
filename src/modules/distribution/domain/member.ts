import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { MemberCreated } from './events/memberCreated'
import { MemberId } from './memberId'
import { MemberDistributionRelation } from './memberDistributionRelation'

interface MemberProps {
  inviteMemberId?: MemberId
  createAt?: number
  inviteToken: string
  distributionRelationList: MemberDistributionRelation[]
}

export class Member extends AggregateRoot<MemberProps> {
  private constructor(props: MemberProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get memberId(): MemberId {
    return MemberId.create(this._id).getValue()
  }

  get inviteMemberId(): MemberId {
    return this.props.inviteMemberId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get inviteToken(): string {
    return this.props.inviteToken
  }

  get distributionRelationList(): MemberDistributionRelation[] {
    return this.props.distributionRelationList
  }

  public updateDistributionRelationList(memberDistributionRelationList: MemberDistributionRelation[]): void {
    this.props.distributionRelationList = memberDistributionRelationList
  }

  public static create(props: MemberProps, id?: UniqueEntityID): Result<Member> {
    const defaultValues: MemberProps = {
      ...props,
      createAt: props.createAt ? props.createAt : Date.now()
    }

    const member = new Member(defaultValues, id)
    const isNewMember = !!id === false

    if (isNewMember) {
      member.addDomainEvent(new MemberCreated(member))
    }

    return Result.ok<Member>(member)
  }
}
