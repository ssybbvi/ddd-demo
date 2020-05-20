import { categoryRepo } from '../../../repos'
import { UpdateCategoryUseCase } from './updateCategoryUseCase'
import { UpdateCategoryController } from './updateCategoryController'

const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepo)
const updateCategoryController = new UpdateCategoryController(updateCategoryUseCase)

export { updateCategoryUseCase, updateCategoryController }
