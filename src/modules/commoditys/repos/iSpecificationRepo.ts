import { Specification } from '../domain/specification'

export interface ISpecificationRepo {
  save(specification: Specification): Promise<void>
  getById(_id: string): Promise<Specification>
  exist(_id: string): Promise<boolean>
  filter(): Promise<Specification[]>
}
