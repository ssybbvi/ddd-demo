import { specificationRepo } from '../../../repos'
import { UpdateSpecificationUseCase } from './updateSpecificationUseCase'
import { UpdateSpecificationController } from './updateSpecificationController'

const updateSpecificationUseCase = new UpdateSpecificationUseCase(specificationRepo)
const updateSpecificationController = new UpdateSpecificationController(updateSpecificationUseCase)

export { updateSpecificationUseCase, updateSpecificationController }
