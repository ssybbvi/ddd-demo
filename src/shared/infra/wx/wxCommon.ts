import axios from 'axios'
import { URLSearchParams } from 'url'
import crypto from 'crypto'

const appid = 'wx84965549e7c05a03'
const secret = 'd2f2cc949db194b87e50779208d9aa4d'

export interface WechatRetError {
  errcode: number
  errmsg: string
}

export interface WechatSession {
  openid: string
  session_key: string
  unionid?: string
}

export class WechatUtil {
  static async jsCodeToSession(code: string): Promise<WechatRetError | WechatSession> {
    let qs = new URLSearchParams()
    qs.append('appid', 'wx84965549e7c05a03')
    qs.append('secret', 'd2f2cc949db194b87e50779208d9aa4d')
    qs.append('js_code', code)
    qs.append('grant_type', 'authorization_code')

    let url = 'https://api.weixin.qq.com/sns/jscode2session?' + qs

    console.log('wx jscode2Session start', url)

    let res: any = (await axios.get(url)).data
    console.log('wx jscode2Session result:', res)

    if ('errcode' in res) {
      console.error('Invalid jscode: ' + code)
      return res as WechatRetError
    }
    return res as WechatSession
  }

  static async decryptedData(opt: { code: string; encryptedData: string; iv: string }) {
    let rs = (await this.jsCodeToSession(opt.code)) as WechatSession
    if (rs && rs.session_key) {
      // base64 decode
      let sessionKey = new Buffer(rs.session_key, 'base64')
      let encryptedDataBuffer = new Buffer(opt.encryptedData, 'base64')
      let ivBuffer = new Buffer(opt.iv, 'base64')

      try {
        // 解密
        let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, ivBuffer)
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true)
        var decoded = decipher.update(encryptedDataBuffer, 'binary', 'utf8')
        decoded += decipher.final('utf8')

        decoded = JSON.parse(decoded)
      } catch (err) {
        throw new Error('Illegal Buffer')
      }

      if (appid !== appid) {
        throw new Error('Illegal Buffer')
      }

      return decoded
    } else {
      throw new Error('Invalid jscode: ' + opt.code)
    }
  }

  static async WXBizDataCrypt(sessionKey: string, encryptedData: string, ivData: string) {
    if (!sessionKey || !encryptedData || !ivData) {
      return
    }
    let _sessionKey = new Buffer(sessionKey, 'base64')
    let _encryptedData = new Buffer(encryptedData, 'base64')
    let _iv = new Buffer(ivData, 'base64')

    let decoded: any = null
    try {
      // 解密
      var decipher = crypto.createDecipheriv('aes-128-cbc', _sessionKey, _iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      decoded = decipher.update(_encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')

      decoded = JSON.parse(decoded)
    } catch (err) {
      throw new Error('Illegal Buffer')
    }

    if (decoded.watermark.appid !== appid) {
      throw new Error('Illegal Buffer')
    }

    return decoded
  }
  static wxOpenIdCryptoToBase64(openId: string, otherStr: string = 'ladygaga'): string {
    if (openId == undefined) {
      return ''
    }
    let _contentStr = openId + otherStr //加密的明文；
    //定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    let _md5Data = crypto.createHash('md5')
    _md5Data.update(_contentStr)
    let _newString = _md5Data.digest('base64') // 'base64' || 'hex' || 'latin1'
    //console.log("加密的结果：" + _newString);
    return _newString
  }

  static async getToken() {
    let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`

    let result = await axios.post(url)
    let { access_token, expires_in } = result.data

    //todo 存redis
    return access_token
  }

  static async sendTemplate(
    touser: string,
    template_id: string,
    page: string,
    form_id: string,
    data: any,
    emphasis_keyword: string
  ) {
    let token = await this.getToken()
    let url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`

    let result = await axios.post(url, {
      touser,
      template_id,
      page,
      form_id,
      data,
      emphasis_keyword
    })

    console.log('=================', result.data)
  }

  static async messageSubscribeSend(touser: string, template_id: string, page: string, data: any) {
    let token = await this.getToken()
    let url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`

    let result = await axios.post(url, {
      touser,
      template_id,
      page,
      data
    })
    console.log('messageSubscribeSend:', result.data)
    return result.data
  }

  static async sendMessage(data: any) {
    let token = await this.getToken()
    let url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${token}`
    return axios.post(url, data)
  }
}
