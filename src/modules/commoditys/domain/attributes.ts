import { WatchedList } from '../../../shared/domain/WatchedList'
import { Attribute } from './attribute'

export class Attributes extends WatchedList<Attribute> {
  private constructor(initialVotes: Attribute[]) {
    super(initialVotes)
  }

  public compareItems(a: Attribute, b: Attribute): boolean {
    return a.equals(b)
  }

  public static create(strategyItem?: Attribute[]): Attributes {
    return new Attributes(strategyItem ? strategyItem : [])
  }
}
