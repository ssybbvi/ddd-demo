import { Db, MongoClient } from 'mongodb'
import { authConfig } from '../../../../config'
export class MongodbClient {
  private clientMap = new Map<string, Db>()
  public mainDb: Db

  constructor() {}

  public async init() {
    this.connectionMainDb()
  }

  private keyFormat(connectionStr: string, dbName: string) {
    return `mongdoDbConnection.${connectionStr}-${dbName}`
  }

  public async connectionMainDb() {
    this.mainDb = await this.connectionDbClient(authConfig.mongoDatabaseUrl, authConfig.mongoDatabaseName)
  }

  public async getMongoDbClent(
    connectionStr: string = authConfig.mongoDatabaseUrl,
    dbName: string = authConfig.mongoDatabaseName
  ): Promise<Db> {
    const key = this.keyFormat(connectionStr, dbName)
    if (this.clientMap.has(key)) {
      return this.clientMap.get(key)
    }

    const mongodbClient = await this.connectionDbClient(connectionStr, dbName)
    this.clientMap.set(key, mongodbClient)
    return mongodbClient
  }

  public async connectionDbClient(connectionDbClient: string, dbName: string) {
    return new Promise<Db>((rs, rj) => {
      MongoClient.connect(
        connectionDbClient,
        {
          autoReconnect: true,
          useNewUrlParser: true,
          poolSize: 5,
        },
        (err, client) => {
          if (err) {
            console.error(' Failed connected db.', err)
            rj(err)
          } else {
            console.log(` Connect db succ.(${connectionDbClient},${dbName})`)
            rs(client.db(dbName))
          }
        }
      )
    })
  }
}
