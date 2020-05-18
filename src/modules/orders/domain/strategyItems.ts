import { WatchedList } from '../../../shared/domain/WatchedList'
import { StrategyItem } from './strategyItem'

export class StrategyItems extends WatchedList<StrategyItem> {
  private constructor(initialVotes: StrategyItem[]) {
    super(initialVotes)
  }

  public compareItems(a: StrategyItem, b: StrategyItem): boolean {
    return a.equals(b)
  }

  public static create(strategyItem?: StrategyItem[]): StrategyItems {
    return new StrategyItems(strategyItem ? strategyItem : [])
  }
}
