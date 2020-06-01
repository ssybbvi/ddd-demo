import { IStrategyDto } from './strategyDto'

export interface ActivityDto {
  _id: string
  isEnable: boolean
  strategy: IStrategyDto
}
