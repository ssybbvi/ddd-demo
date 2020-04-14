export class WssSubscriptions {
  private static keyWssMap = new Map<string, any>()
  private static keySubscriptionnActionMap = new Map<string, string[]>()

  private static setKeyAction(subscriptionnAction: string[], key: string) {
    for (let item of subscriptionnAction) {
      if (!this.keySubscriptionnActionMap.has(item)) {
        this.keySubscriptionnActionMap.set(item, [])
      }
      let subscriptionnAction = this.keySubscriptionnActionMap.get(item)
      subscriptionnAction.push(key)
    }
  }

  private static removeKeyAction(key: string) {
    for (let itemActions of this.keySubscriptionnActionMap.values()) {
      itemActions.splice(
        itemActions.findIndex(item => item === key),
        1
      )
    }
  }

  private static setKeyWss(key: string, wss: any) {
    this.keyWssMap.set(key, wss)
  }

  private static removeKeyWss(key: string) {
    this.keyWssMap.delete(key)
  }

  public static removeKey(key) {
    this.removeKeyWss(key)
    this.removeKeyAction(key)
  }

  public static createWssSubscriptions(key: string, wss: any, subscriptionnAction: string[]) {
    this.setKeyWss(key, wss)
    this.setKeyAction(subscriptionnAction, key)
  }

  public static publish(action: string) {
    const keys = this.keySubscriptionnActionMap.get(action) || []
    console.log('keys', keys)
    const wssList = keys.map(item => {
      return this.keyWssMap.get(item)
    })
    return wssList
  }
}
