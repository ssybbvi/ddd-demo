import express from 'express'
import { middleware } from '../../../../../shared/infra/http'
import { updateAddressUserController } from '../../../useCases/addressUser/updateAddressUser'
import { getAddressUserListController } from '../../../useCases/addressUser/getAddressUserList'
import { createAddressUserController } from '../../../useCases/addressUser/createAddressUser'

const addressUserRouter = express.Router()

addressUserRouter.get('/', middleware.ensureAuthenticated(), (req, res) =>
  getAddressUserListController.execute(req, res)
)
addressUserRouter.post('/', middleware.ensureAuthenticated(), (req, res) =>
  createAddressUserController.execute(req, res)
)
addressUserRouter.put('/', middleware.ensureAuthenticated(), (req, res) =>
  updateAddressUserController.execute(req, res)
)
export { addressUserRouter }
