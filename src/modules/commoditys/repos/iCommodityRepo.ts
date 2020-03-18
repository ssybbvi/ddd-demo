import { Commodity } from '../domain/commodity'

export interface ICommodityRepo {
  save(commodity: Commodity): Promise<void>
  getById(_id: string): Promise<Commodity>
  exist(_id: string): Promise<boolean>
  filter(): Promise<Commodity[]>
}
