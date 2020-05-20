import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createSpecificationController } from '../../../userCases/specifications/createSpecification'
import { getSpecificationListController } from '../../../userCases/specifications/getSpecificationList'
import { updateSpecificationController } from '../../../userCases/specifications/updateSpecification'

const specificationRouter = express.Router()

specificationRouter.post('/', (req, res) => createSpecificationController.execute(req, res))
specificationRouter.get('/', (req, res) => getSpecificationListController.execute(req, res))
specificationRouter.put('/', (req, res) => updateSpecificationController.execute(req, res))

export { specificationRouter }
