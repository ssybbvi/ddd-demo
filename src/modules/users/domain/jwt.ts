export interface JWTClaims {
  userId: string
  tenantId?: string
}

export type JWTToken = string

export type SessionId = string

export type RefreshToken = string
