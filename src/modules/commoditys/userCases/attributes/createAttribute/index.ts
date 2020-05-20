import { CreateAttributeUseCase } from './createAttributeUseCase'
import { attributeRepo } from '../../../repos'
import { CreateAttributeController } from './createAttributeController'

const createAttributeUseCase = new CreateAttributeUseCase(attributeRepo)
const createAttributeController = new CreateAttributeController(createAttributeUseCase)

export { createAttributeUseCase, createAttributeController }
