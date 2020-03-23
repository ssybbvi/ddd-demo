export interface CreateRoleRequestDto {
  name: string
  description: string
  permissionIds: string[]
}
