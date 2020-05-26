import { WatchedList } from '../../../shared/domain/WatchedList'
import { Specification } from './specification'

export class Specifications extends WatchedList<Specification> {
  private constructor(initialVotes: Specification[]) {
    super(initialVotes)
  }

  public compareItems(a: Specification, b: Specification): boolean {
    return a.equals(b)
  }

  public static create(strategyItem?: Specification[]): Specifications {
    return new Specifications(strategyItem ? strategyItem : [])
  }
}
