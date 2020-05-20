import { WatchedList } from '../../../shared/domain/WatchedList'
import { Sku } from './sku'

export class Skus extends WatchedList<Sku> {
  private constructor(initialVotes: Sku[]) {
    super(initialVotes)
  }

  public compareItems(a: Sku, b: Sku): boolean {
    return a.equals(b)
  }

  public static create(strategyItem?: Sku[]): Skus {
    return new Skus(strategyItem ? strategyItem : [])
  }
}
