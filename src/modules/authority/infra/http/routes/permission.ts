import express from 'express'
import { createPermissionController } from '../../../useCases/permission/createPermission'
import { getPermissionController } from '../../../useCases/permission/getPermission'
import { updatePermissionController } from '../../../useCases/permission/updatePermission'
import { deletePermissionController } from '../../../useCases/permission/deletePermission'

const permissionRouter = express.Router()

permissionRouter.post('/', (req, res) => createPermissionController.execute(req, res))
permissionRouter.get('/', (req, res) => getPermissionController.execute(req, res))
permissionRouter.put('/', (req, res) => updatePermissionController.execute(req, res))
permissionRouter.delete('/', (req, res) => deletePermissionController.execute(req, res))

export { permissionRouter }
