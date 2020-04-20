import { AppUser } from "../domain/appUser";

export interface IAppUserRepo {
  save(app: AppUser): Promise<void>
  getById(_id: string): Promise<AppUser>
  getAppUserByAppIdWithUserId(appId: string, userId: string): Promise<AppUser>
}