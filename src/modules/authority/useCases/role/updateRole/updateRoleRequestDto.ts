export interface UpdateRoleRequestDto {
  _id: string
  name: string
  description: string
  permissionIds: string[]
}
