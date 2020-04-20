import { ThirdPartyApp } from "../domain/thirdPartyApp";

export interface IThirdPartyAppRepo {
  save(thirdPartyApp: ThirdPartyApp): Promise<void>
  getById(_id: string): Promise<ThirdPartyApp>
  getThirdPartyAppByAppId(appId: string): Promise<ThirdPartyApp>
  existName(name: string): Promise<boolean>
  existAppId(appId: string): Promise<boolean>
}