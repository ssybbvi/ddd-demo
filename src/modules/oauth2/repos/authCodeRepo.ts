import { AuthCode } from "../domain/authCode";

export interface IAuthCodeRepo {
  save(authCode: AuthCode): Promise<void>
  getById(_id: string): Promise<AuthCode>
  getAuthCodeByAppIdWithCode(appId: string, code: string): Promise<AuthCode>
  getAuthCodeByAppIdWithUserId(appId: string, userId: string): Promise<AuthCode>
}