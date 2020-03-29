import { WxUser } from '../domain/wxUser'

export interface IWxUserRepo {
  filter(): Promise<WxUser[]>
  save(user: WxUser): Promise<void>
  getById(_id: string): Promise<WxUser>
  getUserByWxOpenId(wxOpenId: string): Promise<WxUser>
  existsWxOpenId(wxOpenId: string): Promise<boolean>
}
