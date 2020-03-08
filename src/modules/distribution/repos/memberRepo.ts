import { Member } from '../domain/member'
import { MemberId } from '../domain/memberId'

export interface IMemberRepo {
  existsById(_id: string): Promise<boolean>
  getById(_id: string): Promise<Member>
  existsByInviteToken(inviteToken: string): Promise<boolean>
  getByInviteToken(inviteToken: string): Promise<Member>
  save(member: Member): Promise<void>
}
