import { IMapper } from '../../../shared/infra/Mapper'
import { Member } from '../domain/member'
import { MemberDTO } from '../dtos/memberDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { UserName } from '../../users/domain/userName'
import { UserId } from '../../users/domain/userId'
import { IMemberDbModel } from '../dbModels/iMemberDbModel'
import { MemberId } from '../domain/memberId'

export class MemberMap implements IMapper<Member> {
  public static toDomain(raw: IMemberDbModel): Member {
    const userIdOrError = UserId.create(new UniqueEntityID(raw.userId))

    let inviteMemberId: MemberId = raw.inviteMemberId
      ? MemberId.create(new UniqueEntityID(raw.inviteMemberId)).getValue()
      : null

    const memberOrError = Member.create(
      {
        userId: userIdOrError.getValue(),
        createAt: raw.createAt,
        inviteToken: raw.inviteToken,
        inviteMemberId: inviteMemberId
      },
      new UniqueEntityID(raw._id)
    )

    memberOrError.isFailure ? console.log(memberOrError.error) : ''

    return memberOrError.isSuccess ? memberOrError.getValue() : null
  }

  public static toPersistence(member: Member): IMemberDbModel {
    return {
      _id: member.id.toString(),
      userId: member.userId.id.toString(),
      inviteMemberId: member.inviteMemberId ? member.inviteMemberId.id.toString() : null,
      createAt: member.createAt,
      inviteToken: member.inviteToken
    }
  }
}
