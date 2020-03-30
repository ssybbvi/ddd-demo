import { DayDayTask } from '../domain/dayDayTask'

export interface IDayDayTaskRepo {
  save(dayDayTask: DayDayTask): Promise<void>
  getById(_id: string): Promise<DayDayTask>
  exist(_id: string): Promise<boolean>
  filter(userId: string): Promise<DayDayTask[]>
  getByUserIdWithType(userId: string, type: string): Promise<DayDayTask>
}
