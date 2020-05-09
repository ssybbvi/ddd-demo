import WebSocket from 'ws'

import { URLSearchParams } from 'url'
import { WssSubscriptions } from './wssSubscriptions';

const wss = new WebSocket.Server({ port: 28080 });


wss.on('connection', (ws, req) => {
  const paramsString = req.url.substr(1) //去掉/
  var searchParams = new URLSearchParams(paramsString);
  const actions = searchParams.get("actions") as string
  if (!actions) {
    return
  }

  const actionList = actions.split(',')
  if (Reflect.defineProperty(ws, "actions", { value: actionList })) {
    WssSubscriptions.instance.subscriptionnActions(actionList, ws)
    console.log('Reflect.defineProperty actions ok')
  } else {
    console.error('Reflect.defineProperty actions error')
  }

  ws.on('close', () => {
    console.log('disconnected');
    if (!ws["actions"]) {
      return
    }
    const actions = ws["actions"] as string[]
    WssSubscriptions.instance.unSubscriptionnActions(actions, ws)
  });
});




