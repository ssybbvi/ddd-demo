import express from 'express'
import { getAuthorityUserListController } from '../../../useCases/authorityUsers/getAuthorityUserList'
import { createAuthorityUserController } from '../../../useCases/authorityUsers/createAuthorityUser'

const authorityUserRouter = express.Router()
authorityUserRouter.get('/', (req, res) => getAuthorityUserListController.execute(req, res))
authorityUserRouter.post('/', (req, res) => createAuthorityUserController.execute(req, res))
export { authorityUserRouter }
