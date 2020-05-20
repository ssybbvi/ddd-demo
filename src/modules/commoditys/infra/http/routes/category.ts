import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { createCategoryController } from '../../../userCases/categorys/createCategory'
import { getCategoryListController } from '../../../userCases/categorys/getCategoryList'
import { updateCategoryController } from '../../../userCases/categorys/updateCategory'

const categoryRouter = express.Router()

categoryRouter.post('/', (req, res) => createCategoryController.execute(req, res))
categoryRouter.get('/', (req, res) => getCategoryListController.execute(req, res))
categoryRouter.put('/', (req, res) => updateCategoryController.execute(req, res))

export { categoryRouter }
