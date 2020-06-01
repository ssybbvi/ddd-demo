import { IStrategyDto } from '../../../dtos/strategyDto'

export interface ICreateActivityDto {
  isEnable: boolean
  strategyDto: IStrategyDto
}
