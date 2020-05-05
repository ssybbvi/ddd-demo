export interface ITenantDbModels {
  _id: string
  name: string
  mongodbConnection?: {
    url: string
    dbName: string
  }
  isActive: boolean
}
