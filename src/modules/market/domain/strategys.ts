import { WatchedList } from '../../../shared/domain/WatchedList'
import { Strategy } from './strategy'
import { RewardDiscount } from './rewardDiscount'
import { RewardReliefAmount } from './rewardReliefAmount'

export class Strategys extends WatchedList<Strategy> {
  private constructor(initialVotes: Strategy[]) {
    super(initialVotes)
  }

  public compareItems(a: Strategy, b: Strategy): boolean {
    return a.equals(b)
  }

  public static create(strategy?: Strategy[]): Strategys {
    return new Strategys(strategy ? strategy : [])
  }

  public getTotalAmountOfDiscount(): number {
    let totalAmountOfDiscount = 0
    for (let item of this.getItems()) {
      if (item.reward.type === 'discount') {
        totalAmountOfDiscount += (item.reward as RewardDiscount).rewardDiscountAmount
      }
      if (item.reward.type === 'reliefAmount') {
        totalAmountOfDiscount += (item.reward as RewardReliefAmount).reliefAmount
      }
    }
    return totalAmountOfDiscount
  }
}
