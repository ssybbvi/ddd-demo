export interface UserDTO {
  _id: string
  lastLogin?: Date
  createAt?: number
  inviteToken?: string
  inviteRecommendedUserId?: string
}
