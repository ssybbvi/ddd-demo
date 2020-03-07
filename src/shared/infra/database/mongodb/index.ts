import { Db, MongoClient } from 'mongodb'
import { authConfig } from '../../../../config'

export class Global {
  mongoDb!: Db

  private static _instance: Global
  static get instance(): Global {
    if (!this._instance) {
      this._instance = new Global()
    }
    return this._instance
  }

  private _isInited = false
  async init() {
    if (this._isInited) {
      return
    }

    this._isInited = true
    this.mongoDb = await this.getMongoDb(authConfig.mongoDatabaseUrl, authConfig.mongoDatabaseName)
  }

  private getMongoDb(uri: string, dbName: string): Promise<Db> {
    console.log(`Start connecting db...(${uri})`)
    return new Promise<Db>((rs, rj) => {
      MongoClient.connect(
        uri,
        {
          autoReconnect: true,
          useNewUrlParser: true,
          poolSize: 5
        },
        (err, client) => {
          if (err) {
            console.log(' Failed connected db.', err)
            rj(err)
          } else {
            console.log(` Connect db succ.(${uri})`)
            rs(client.db(dbName))
          }
        }
      )
    })
  }
}
