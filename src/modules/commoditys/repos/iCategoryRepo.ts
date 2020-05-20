import { Category } from '../domain/category'

export interface ICategoryRepo {
  save(category: Category): Promise<void>
  getById(_id: string): Promise<Category>
  exist(_id: string): Promise<boolean>
  filter(): Promise<Category[]>
}
