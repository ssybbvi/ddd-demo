import { IStrategyDto } from '../../../dtos/strategyDto'

export interface IUpdateActivityDto {
  _id: string
  isEnable: boolean
  strategyDtoList: IStrategyDto[]
}
