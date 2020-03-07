export interface IMemberDbModel {
  _id: string
  userId: string
  inviteMemberId?: string
  createAt: number
  inviteToken: string
}
