import express from 'express'
import { getAuthorityUserListController } from '../../../useCases/authorityUsers/getAuthorityUserList'
import { createAuthorityUserController } from '../../../useCases/authorityUsers/createAuthorityUser'
import { middleware } from '../../../../../shared/infra/http'

const authorityUserRouter = express.Router()
authorityUserRouter.get('/', middleware.ensureAuthenticated(), (req, res) => getAuthorityUserListController.execute(req, res))
authorityUserRouter.post('/', middleware.ensureAuthenticated(), (req, res) => createAuthorityUserController.execute(req, res))
export { authorityUserRouter }
