export class CreateTenantRequestDto {
  name: string
  mongodbConnection?: {
    url: string
    dbName: string
  }
  isActive: boolean
}
