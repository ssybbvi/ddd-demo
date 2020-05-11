import { Strategy } from "../domain/strategy";

export interface IStrategyRepo {
  save(strategy: Strategy): Promise<void>
  getById(_id: string): Promise<Strategy>
  filter(): Promise<Strategy[]>
}