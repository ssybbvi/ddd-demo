export interface IThirdPartyAppDto {
  name: string,
  appId: string
  secret: string
  createAt: number,
}

export interface IThirdPartyAppByTokenDto {
  accessToken: string,
  expiresIn: number
}

