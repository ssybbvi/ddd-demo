import { IDomainEvent } from './IDomainEvent'
import { AggregateRoot } from '../AggregateRoot'
import { UniqueEntityID } from '../UniqueEntityID'

export class DomainEvents {
  private static handlersMap = {}
  private static markedAggregates: AggregateRoot<any>[] = []

  /**
   * @method markAggregateForDispatch
   * @static
   * @desc Called by aggregate root objects that have created domain
   * events to eventually be dispatched when the infrastructure commits
   * the unit of work.
   */

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  private static async dispatchAggregateEvents(aggregate: AggregateRoot<any>): Promise<void> {
    for (let item of aggregate.domainEvents) {
      this.dispatch(item)
    }
    //aggregate.domainEvents.forEach((event: IDomainEvent) => this.dispatch(event))
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex(a => a.equalsId(aggregate))
    this.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateByID(aggregateRoot: AggregateRoot<any>): AggregateRoot<any> {
    let found: AggregateRoot<any> = null
    for (let _aggregate of this.markedAggregates) {
      if (_aggregate.equalsId(aggregateRoot)) {
        found = _aggregate
      }
    }
    return found
  }

  static async dispatchEventsForAggregate(aggregateRoot: AggregateRoot<any>): Promise<void> {
    const aggregate = this.findMarkedAggregateByID(aggregateRoot)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static register(callback: (event: IDomainEvent) => void, eventClassName: string): void {
    if (!this.handlersMap.hasOwnProperty(eventClassName)) {
      this.handlersMap[eventClassName] = []
    }
    this.handlersMap[eventClassName].push(callback)
  }

  public static clearHandlers(): void {
    this.handlersMap = {}
  }

  public static clearMarkedAggregates(): void {
    this.markedAggregates = []
  }

  private static async dispatch(event: IDomainEvent): Promise<void> {
    const eventClassName: string = event.constructor.name

    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: any[] = this.handlersMap[eventClassName]
      for (let handler of handlers) {
        handler(event)
      }
    }
  }
}
