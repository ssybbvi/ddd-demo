import { IDomainEvent } from './IDomainEvent'

export type DomainEvenntFn = (event: IDomainEvent) => Promise<void>

export interface DomainEvent {
  isNeedAwait: boolean
  domainEvenntFn: DomainEvenntFn
}

export interface IHandle<IDomainEvent> {
  setupSubscriptions(): void
}
