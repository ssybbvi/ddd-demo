export interface JWTClaims {
  userId: string

}

export interface TenantJwtClaims {
  tenantId: string
}

export type JWTToken = string

export type SessionId = string

export type RefreshToken = string
