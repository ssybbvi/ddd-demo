import { Bargain } from "../domain/bargain";

export interface IBargainRepo {
  save(orderUser: Bargain): Promise<void>
  getById(_id: string): Promise<Bargain>
  exist(_id: string): Promise<boolean>
  filter(userId?: string): Promise<Bargain[]>
  getParticpantsCountByUserId(userId: string, recentTime?: number)
}
