import axios from 'axios'

import { Either, Result, left, right } from '../../../shared/core/Result'
import { WxAuthorizationErrors } from '../useCases/wxAuthorization/wxAuthorizationErrors'
import { AppError } from '../../../shared/core/AppError'
import { URLSearchParams } from 'url'

export type Response = Either<
  WxAuthorizationErrors.WxJsCodeToSessionError | AppError.UnexpectedError | Result<any>,
  Result<WxJsCodeToSessionResult>
>

export interface WxJsCodeToSessionResult {
  openid: string
  session_key: string
  unionid?: string
}

export interface WxJsCodeToSessionErrorMessage {
  errcode: number
  errmsg: string
}

export class WxAuthrizationService {
  constructor() {}

  async jsCodeToSession(code: string): Promise<Response> {
    return right(
      Result.ok<WxJsCodeToSessionResult>({
        openid: 'one',
        session_key: '222',
        unionid: '333'
      })
    )

    let qs = new URLSearchParams()
    qs.append('appid', 'wx03241bf8686d6292')
    qs.append('secret', 'f1dddcaf1e6dd2638c75925740c8198e')
    qs.append('js_code', code)
    qs.append('grant_type', 'authorization_code')

    let url = 'https://api.weixin.qq.com/sns/jscode2session?' + qs

    console.log('wx jscode2Session start', url)

    let res: any = (await axios.get(url)).data
    console.log('wx jscode2Session result:', res)

    if ('errcode' in res) {
      console.error('Invalid jscode: ' + code)
      return left(new WxAuthorizationErrors.WxJsCodeToSessionError(res.errmsg))
    }

    const result: WxJsCodeToSessionResult = res as WxJsCodeToSessionResult
    return right(Result.ok<WxJsCodeToSessionResult>(result))
  }
}
