import { WssSubscriptions } from './wssSubscriptions'

WssSubscriptions.createWssSubscriptions('xx1', 'xx1-wss', ['aaa', 'bbb'])
WssSubscriptions.createWssSubscriptions('xx2', 'xx2-wss', ['aaa', 'ccc'])
WssSubscriptions.createWssSubscriptions('xx3', 'xx3-wss', ['bbb', 'ccc'])

WssSubscriptions.removeKey('xx2')
let result = WssSubscriptions.publish('ccc')
console.log(result)
