export interface ITenantDTO {
  name: string
  mongodbConnection?: IMongodbConnectionDto
  isActive: boolean
}

export interface IMongodbConnectionDto {
  url: string
  dbName: string
}
