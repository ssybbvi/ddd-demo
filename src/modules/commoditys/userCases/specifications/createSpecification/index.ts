import { CreateSpecificationUseCase } from './createSpecificationUseCase'
import { specificationRepo } from '../../../repos'
import { CreateSpecificationController } from './createSpecificationController'

const createSpecificationUseCase = new CreateSpecificationUseCase(specificationRepo)
const createSpecificationController = new CreateSpecificationController(createSpecificationUseCase)

export { createSpecificationUseCase, createSpecificationController }
