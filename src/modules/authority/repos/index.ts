import { AuthorityUserRepo } from './implementations/mongoAuthorityUserRepo'
import { MongoRoleRepo } from './implementations/mongoRoleRepo'
import { MongoPermissionRepo } from './implementations/mongoPermissionRepo'

const authorityUserRepo = new AuthorityUserRepo()
const roleRepo = new MongoRoleRepo()
const permissionRepo = new MongoPermissionRepo()

export { authorityUserRepo, roleRepo, permissionRepo }
