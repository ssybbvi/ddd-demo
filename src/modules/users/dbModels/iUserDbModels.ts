import { JWTToken, RefreshToken } from '../domain/jwt'
import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels';
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel';

export interface IUserDbModels extends IBaseIdDbModels, ITenantIdDbModel {

  accessToken?: JWTToken
  refreshToken?: RefreshToken
  isDeleted?: boolean
  lastLogin?: number
  inviteRecommendedUserId?: string
  createAt: number
  inviteToken: string
}
