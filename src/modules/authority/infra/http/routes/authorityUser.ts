import express from 'express'
import { getAuthorityUserListController } from '../../../useCases/authorityUsers/getAuthorityUserList'

const authorityUserRouter = express.Router()
authorityUserRouter.get('/', (req, res) => getAuthorityUserListController.execute(req, res))

export { authorityUserRouter }
