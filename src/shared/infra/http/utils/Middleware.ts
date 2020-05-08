import { isProduction } from '../../../../config'
import { IAuthService } from '../../auth/authService'
const rateLimit = require('express-rate-limit')
import * as fs from 'fs'
import formidable from 'formidable'
import ossAliyun from 'ali-oss'
import uuid from 'uuid/v4'
import { clsNameSpace } from '../../cls'
import express from 'express'
import { MongodbWithTenant } from '../../database/mongodb/mongodbTenant'


export class Middleware {
  private authService: IAuthService

  constructor(authService: IAuthService) {
    this.authService = authService
  }

  private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
    return res.status(status).send({ message })
  }

  public includeDecodedTokenIfExists() {
    return async (req, res, next) => {
      const token = req.headers['authorization']
      // Confirm that the token was signed with our signature.
      if (token) {
        const decoded = await this.authService.decodeJWT(token)
        const signatureFailed = !!decoded === false

        if (signatureFailed) {
          return res.status(200).send({ message: 'Token过期啦' })
        }

        // See if the token was found
        const { userId } = decoded
        const tokens = await this.authService.getTokens(userId)

        // if the token was found, just continue the request.
        if (tokens.length !== 0) {
          req.decoded = decoded
          return next()
        } else {
          return next()
        }
      } else {
        return next()
      }
    }
  }

  public ensureAuthenticatedTenant() {
    return async (req: express.Request, res, next) => {
      if (req.url.includes('/api/v1/tenant')) {
        next()
        return
      }

      const tenantId = req.headers['authorization-tenant'] as string

      const tenantIds = MongodbWithTenant.instance.getTenantIds()
      if (!tenantId) {
        return res.status(200).send({ message: '需要http请求头authorization-tenant' })
      }

      if (tenantIds.includes(tenantId)) {
        return res.status(200).send({ message: 'authorization-tenant配置信息错误' })
      }

      clsNameSpace.run(() => {
        console.log('==========set:tenantId==========', tenantId)
        clsNameSpace.set('tenantId', tenantId)
        return next()
      });
    }
  }

  public ensureAuthenticated() {
    return async (req, res, next) => {
      const token = req.headers['authorization']
      if (!token) {
        return res.status(200).send({ message: 'No access token provided' })
      }

      const decoded = await this.authService.decodeJWT(token)
      const signatureFailed = !!decoded === false

      if (signatureFailed) {
        return res.status(200).send({ message: 'Token过期啦' })
      }

      const { userId } = decoded
      if (!userId) {
        return res
          .status(200)
          .send({ message: '请登录获取token' })
      }

      const tokens = await this.authService.getTokens(userId)

      if (tokens.length === 0) {
        return res
          .status(200)
          .send({ message: 'Auth token not found. User is probably not logged in. Please login again.' })
      }

      req.decoded = decoded
      return next()
    }
  }

  public static createRateLimit(mins: number, maxRequests: number) {
    return rateLimit({
      windowMs: mins * 60 * 1000,
      max: maxRequests,
    })
  }

  public static restrictedUrl(req, res, next) {
    if (!isProduction) {
      return next()
    }

    const approvedDomainList = ['https://xxx.com']

    const domain = req.headers.origin

    const isValidDomain = !!approvedDomainList.find((d) => d === domain)
    console.log(`Domain =${domain}, valid?=${isValidDomain}`)

    if (!isValidDomain) {
      return res.status(403).json({ message: 'Unauthorized' })
    } else {
      return next()
    }
  }

  public static upload() {
    //TODO 待优化
    return async (req, res, next) => {
      let client = new ossAliyun({
        region: 'oss-cn-shenzhen',
        accessKeyId: 'LTAI4FtmLY3CAR639p3otxJX',
        accessKeySecret: 'zgbVP5Il45Z4nJROIHe8HQ968zRvAv',
        bucket: 'xiaoailingdong',
      })

      var form = new formidable.IncomingForm()
      form.parse(req, (error, fields, files) => {
        console.log('error:', error)
        console.log('fields', fields)
        console.log(files.file.path)

        const newFileName = `${uuid()}.png`
        const newFilePath = `/JiFen-ZhuanLe/images/commodity/${newFileName}`
        const newUrl = `http://oss.ixald.com${newFilePath}`

        let stream = fs.createReadStream(files.file.path)
        client
          .putStream(`/JiFen-ZhuanLe/images/commodity/${newFileName}`, stream)
          .then(() => {
            console.log('okokokok')
            res.send({
              name: newFileName,
              status: 'done',
              url: newUrl,
              thumbUrl: newUrl,
            })
          })
          .catch((error) => {
            console.log('errorerror', error)
          })
      })
    }
  }
}




