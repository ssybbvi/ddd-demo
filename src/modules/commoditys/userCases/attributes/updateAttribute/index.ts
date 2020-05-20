import { attributeRepo } from '../../../repos'
import { UpdateAttributeUseCase } from './updateAttributeUseCase'
import { UpdateAttributeController } from './updateAttributeController'

const updateAttributeUseCase = new UpdateAttributeUseCase(attributeRepo)
const updateAttributeController = new UpdateAttributeController(updateAttributeUseCase)

export { updateAttributeUseCase, updateAttributeController }
