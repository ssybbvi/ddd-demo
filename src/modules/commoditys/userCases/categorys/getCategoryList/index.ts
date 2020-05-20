import { GetCategoryListUseCase } from './getCategoryListUseCase'
import { categoryRepo } from '../../../repos'
import { GetCategoryListController } from './getCategoryListController'

const getCategoryListUseCase = new GetCategoryListUseCase(categoryRepo)
const getCategoryListController = new GetCategoryListController(getCategoryListUseCase)

export { getCategoryListUseCase, getCategoryListController }
