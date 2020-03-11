import { FundAccount } from '../domain/fundAccount'

export interface IFundAccountRepo {
  save(fundAccount: FundAccount): Promise<void>
  getById(_id: string): Promise<FundAccount>
  exist(_id: string): Promise<boolean>
}
