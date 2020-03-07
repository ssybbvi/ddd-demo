import { Member } from '../domain/member'
import { MemberId } from '../domain/memberId'

export interface IMemberRepo {
  existsByUserId(userId: string): Promise<boolean>
  existsById(_id: string): Promise<boolean>
  existsByInviteToken(inviteToken: string): Promise<boolean>
  getByInviteToken(inviteToken: string): Promise<Member>
  getMemberByUserId(userId: string): Promise<Member>
  getMemberIdByUserId(userId: string): Promise<MemberId>
  getMemberByUserName(username: string): Promise<Member>
  save(member: Member): Promise<void>
}
