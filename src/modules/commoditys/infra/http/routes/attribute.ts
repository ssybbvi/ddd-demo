import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createAttributeController } from '../../../userCases/attributes/createAttribute'
import { getAttributeListController } from '../../../userCases/attributes/getAttributeList'
import { updateAttributeController } from '../../../userCases/attributes/updateAttribute'

const attributeRouter = express.Router()

attributeRouter.post('/', (req, res) => createAttributeController.execute(req, res))
attributeRouter.get('/', (req, res) => getAttributeListController.execute(req, res))
attributeRouter.put('/', (req, res) => updateAttributeController.execute(req, res))

export { attributeRouter }
