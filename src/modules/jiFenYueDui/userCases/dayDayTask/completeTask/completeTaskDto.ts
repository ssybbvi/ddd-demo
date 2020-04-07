import { DayDayTaskType } from '../../../domain/dayDayTaskType'

export interface CompleteTaskDto {
  userId: string
  type: DayDayTaskType
}
