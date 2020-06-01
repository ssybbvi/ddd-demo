import { Activity } from '../domain/activity'

export interface IActivityRepo {
  save(activity: Activity): Promise<void>
  getById(_id: string): Promise<Activity>
  filter(): Promise<Activity[]>
  filterByEnable(): Promise<Activity[]>
}
