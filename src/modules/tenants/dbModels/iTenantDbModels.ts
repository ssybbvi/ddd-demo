export interface ITenantDbModels {
  _id: string
  name: string
  mongodbConnection: IMongodbConnectionDbModel
  isActive: boolean
}

export interface IMongodbConnectionDbModel {
  url: string
  dbName: string
}