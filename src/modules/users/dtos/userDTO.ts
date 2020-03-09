export interface UserDTO {
  _id: string
  isDeleted?: boolean
  platform: {
    wx?: WxDTO
  }
}

export interface WxDTO {
  openId: string
  unionId: string
  sessionKey: string
  nickName?: string
  avatarUrl?: string
  gender?: number
}
