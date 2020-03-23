import { UserDTO } from '../../users/dtos/userDTO'

export interface AuthorityUserDTO {
  _id: string
  name: string
  roleIds: string[]
}
