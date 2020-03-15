import { IMapper } from '../../../shared/infra/Mapper'
import { Member } from '../domain/member'
import { MemberDTO } from '../dtos/memberDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { UserId } from '../../users/domain/userId'
import { IMemberDbModel } from '../dbModels/iMemberDbModel'
import { MemberId } from '../domain/memberId'
import { MemberDistributionRelation } from '../domain/memberDistributionRelation'

export class MemberMap implements IMapper<Member> {
  public static toDomain(raw: IMemberDbModel): Member {
    let inviteMemberId: MemberId = raw.inviteMemberId
      ? MemberId.create(new UniqueEntityID(raw.inviteMemberId)).getValue()
      : null

    let distributionRelationList = raw.distributionRelationList.map(item => {
      let memberDistributionRelationOrErrors = MemberDistributionRelation.create({
        memberId: item.memberId,
        distributionRate: item.distributionRate,
        fundType: item.fundType
      })
      return memberDistributionRelationOrErrors.getValue()
    })

    const memberOrError = Member.create(
      {
        createAt: raw.createAt,
        inviteToken: raw.inviteToken,
        inviteMemberId: inviteMemberId,
        distributionRelationList: distributionRelationList
      },
      new UniqueEntityID(raw._id)
    )

    memberOrError.isFailure ? console.log(memberOrError.error) : ''

    return memberOrError.isSuccess ? memberOrError.getValue() : null
  }

  public static toPersistence(member: Member): IMemberDbModel {
    let distributionRelationList = member.distributionRelationList.map(item => {
      return {
        memberId: item.props.memberId,
        distributionRate: item.props.distributionRate,
        fundType: item.props.fundType
      }
    })

    return {
      _id: member.id.toString(),
      inviteMemberId: member.inviteMemberId ? member.inviteMemberId.id.toString() : null,
      createAt: member.createAt,
      inviteToken: member.inviteToken,
      distributionRelationList: distributionRelationList
    }
  }

  public static toDTO(member: Member): MemberDTO {
    let distributionRelationList = member.distributionRelationList.map(item => {
      return {
        memberId: item.props.memberId,
        distributionRate: item.props.distributionRate,
        fundType: item.props.fundType
      }
    })

    return {
      _id: member.id.toString(),
      inviteMemberId: member.inviteMemberId ? member.inviteMemberId.id.toString() : null,
      createAt: member.createAt,
      inviteToken: member.inviteToken,
      distributionRelationList: distributionRelationList
    }
  }
}
