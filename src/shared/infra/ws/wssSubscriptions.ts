import WebSocket from "ws"

export interface IWsMessage {
  action: string
  data: object
}

export class WssSubscriptions {
  private static _instance: WssSubscriptions
  static get instance(): WssSubscriptions {
    if (!this._instance) {
      this._instance = new WssSubscriptions()
    }
    return this._instance
  }


  private subscriptionWsMap = new Map<string, WebSocket[]>()

  public subscriptionnActions(actions: string[], ws: WebSocket) {
    for (let item of actions) {
      this.subscriptionnAction(item, ws)
    }
  }

  private subscriptionnAction(action: string, ws: WebSocket) {
    if (!this.subscriptionWsMap.has(action)) {
      this.subscriptionWsMap.set(action, [])
    }
    this.subscriptionWsMap.get(action).push(ws)
  }

  public unSubscriptionnActions(actions: string[], ws: WebSocket) {
    for (let item of actions) {
      this.unSubscriptionnAction(item, ws)
    }
  }

  private unSubscriptionnAction(action: string, ws: WebSocket) {
    if (!this.subscriptionWsMap.has(action)) {
      this.subscriptionWsMap.set(action, [])
    }
    const wsList = this.subscriptionWsMap.get(action)
    wsList.splice(
      wsList.findIndex(item => Object.is(item, ws)),
      1
    )
  }

  public publish(action: string, messsage: string) {
    const wsList = this.subscriptionWsMap.get(action)

    if (!wsList) {
      return
    }
    for (let item of wsList) {
      item.send(messsage)
    }
  }
}
