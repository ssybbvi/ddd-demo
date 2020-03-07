import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { UserId } from '../../users/domain/userId'
import { UserName } from '../../users/domain/userName'
import { Guard } from '../../../shared/core/Guard'
import { MemberCreated } from './events/memberCreated'
import { MemberId } from './memberId'

interface MemberProps {
  userId: UserId
  inviteMemberId?: MemberId
  createAt: number
  inviteToken: string
}

export class Member extends AggregateRoot<MemberProps> {
  private constructor(props: MemberProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get memberId(): MemberId {
    return MemberId.create(this._id).getValue()
  }

  get userId(): UserId {
    return this.props.userId
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

  private updateInviteToken(inviteToken: string) {
    this.props.inviteToken = inviteToken
  }

  public static create(props: MemberProps, id?: UniqueEntityID): Result<Member> {
    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: props.userId, argumentName: 'userId' }])

    if (!guardResult.succeeded) {
      return Result.fail<Member>(guardResult.message)
    }

    const defaultValues: MemberProps = {
      ...props,
      createAt: Date.now(),
      inviteToken: ''
    }

    const member = new Member(defaultValues, id)
    const isNewMember = !!id === false

    if (isNewMember) {
      member.updateInviteToken(member.id.toString())
      member.addDomainEvent(new MemberCreated(member))
    }

    return Result.ok<Member>(member)
  }
}
