import { TenantJwtClaims } from "../../../../users/domain/jwt";

export interface GetTenantTokenDtoResponse {
  tenantAccessToken: TenantJwtClaims
}