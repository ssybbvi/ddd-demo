import { ScheduledTask } from '../domain/scheduledTask'

export interface IScheduledTaskRepo {
  save(dayDayTask: ScheduledTask): Promise<void>
  getById(_id: string): Promise<ScheduledTask>
  exist(_id: string): Promise<boolean>
  filter(userId: string): Promise<ScheduledTask[]>
  filterByExecutable(): Promise<ScheduledTask[]>
}
