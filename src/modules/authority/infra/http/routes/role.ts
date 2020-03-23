import express from 'express'
import { createRoleController } from '../../../useCases/role/createRole'
import { getRoleController } from '../../../useCases/role/getRole'
import { updateRoleController } from '../../../useCases/role/updateRole'
import { deleteRoleController } from '../../../useCases/role/deleteRole'
const roleRouter = express.Router()

roleRouter.post('/', (req, res) => createRoleController.execute(req, res))
roleRouter.get('/', (req, res) => getRoleController.execute(req, res))
roleRouter.put('/', (req, res) => updateRoleController.execute(req, res))
roleRouter.delete('/', (req, res) => deleteRoleController.execute(req, res))

export { roleRouter }
