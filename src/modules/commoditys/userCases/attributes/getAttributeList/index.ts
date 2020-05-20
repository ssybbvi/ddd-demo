import { GetAttributeListUseCase } from './getAttributeListUseCase'
import { attributeRepo } from '../../../repos'
import { GetAttributeListController } from './getAttributeListController'

const getAttributeListUseCase = new GetAttributeListUseCase(attributeRepo)
const getAttributeListController = new GetAttributeListController(getAttributeListUseCase)

export { getAttributeListUseCase, getAttributeListController }
