import { ScheduledTaskType } from '../../../domain/scheduledTaskType'
import { NotificationWxSubscribe } from '../../../domain/scheduledTask'

export interface CreateScheduledTaskDto {
  argument: NotificationWxSubscribe
  userId: string
  type: ScheduledTaskType
  executionTime: number
}
