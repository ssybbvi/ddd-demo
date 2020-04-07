import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { DayDayTask } from '../dayDayTask'

export class DayDayTaskCreated implements IDomainEvent {
  public dateTimeOccurred: Date
  public dayDayTask: DayDayTask

  constructor(dayDayTask: DayDayTask) {
    this.dateTimeOccurred = new Date()
    this.dayDayTask = dayDayTask
  }

  getAggregateId(): UniqueEntityID {
    return this.dayDayTask.id
  }
}
