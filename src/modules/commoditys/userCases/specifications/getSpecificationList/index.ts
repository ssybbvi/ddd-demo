import { GetSpecificationListUseCase } from './getSpecificationListUseCase'
import { specificationRepo } from '../../../repos'
import { GetSpecificationListController } from './getSpecificationListController'

const getSpecificationListUseCase = new GetSpecificationListUseCase(specificationRepo)
const getSpecificationListController = new GetSpecificationListController(getSpecificationListUseCase)

export { getSpecificationListUseCase, getSpecificationListController }
