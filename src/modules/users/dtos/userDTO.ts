export interface UserDTO {
  _id: string
  lastLogin?: number
  createAt?: number
  inviteToken?: string
  inviteRecommendedUserId?: string
}
