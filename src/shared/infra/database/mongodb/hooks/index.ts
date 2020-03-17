import { UniqueEntityID } from '../../../../domain/UniqueEntityID'
import { DomainEvents } from '../../../../domain/events/DomainEvents'

export const dispatchEventsCallback = (model: any) => {
  const aggregateId = new UniqueEntityID(model['_id'])
  //DomainEvents.dispatchEventsForAggregate(aggregateId)
}
;(async function createHooksForAggregateRoots() {
  console.log('[Hooks]: Sequelize hooks setup.')
})()
