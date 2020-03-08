import { Fund } from '../domain/fund'

export interface IFundRepo {
  getById(id: string): Promise<Fund>
  save(fund: Fund): Promise<void>
  filter(): Promise<Fund[]>
}
