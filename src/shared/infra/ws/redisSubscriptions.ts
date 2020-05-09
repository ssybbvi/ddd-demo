import { WssSubscriptions, IWsMessage } from "./wssSubscriptions";
import { authConfig } from "../../../config";
import redis from 'redis'


export class RedisSubscriptions {
  private subscribeRedis
  private publishRedis

  private static _instance: RedisSubscriptions
  private subscribeName = 'websocket-subscribe'
  static get instance(): RedisSubscriptions {
    if (!this._instance) {
      this._instance = new RedisSubscriptions()
    }
    return this._instance
  }

  public init() {
    this.initSubscribe().then(() => {
      this.subscribeMessage()
    })
    this.initPublish()
  }

  public async initSubscribe() {
    const port = authConfig.redisServerPort
    const host = authConfig.redisServerURL
    const password = authConfig.redisPassword

    this.subscribeRedis = redis.createClient(port, host, {
      password,
    }) // creates a new client

    return new Promise((res) => {
      this.subscribeRedis.on('connect', () => {
        console.log(`initSubscribe succeeded`)
        res()
      })
    })
  }

  public async initPublish() {
    const port = authConfig.redisServerPort
    const host = authConfig.redisServerURL
    const password = authConfig.redisPassword

    this.publishRedis = redis.createClient(port, host, {
      password,
    }) // creates a new client

    return new Promise((res) => {
      this.publishRedis.on('connect', () => {
        console.log(`initPublish succeeded`)
        res()
      })
    })
  }

  public subscribeMessage() {
    this.subscribeRedis.on("message", (channel, message) => {
      if (channel != this.subscribeName) {
        return
      }

      let data = JSON.parse(message)
      const wsMessage = data as IWsMessage
      WssSubscriptions.instance.publish(wsMessage.action, JSON.stringify(wsMessage.data))
    });
    this.subscribeRedis.subscribe(this.subscribeName);
  }



  public publish(message: IWsMessage) {
    let strData = JSON.stringify(message)
    this.publishRedis.publish(this.subscribeName, strData)
  }
}