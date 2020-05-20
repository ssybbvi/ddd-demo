import { CreateCategoryUseCase } from './createCategoryUseCase'
import { categoryRepo } from '../../../repos'
import { CreateCategoryController } from './createCategoryController'

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo)
const createCategoryController = new CreateCategoryController(createCategoryUseCase)

export { createCategoryUseCase, createCategoryController }
