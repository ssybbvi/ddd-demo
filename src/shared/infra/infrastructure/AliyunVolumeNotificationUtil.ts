import Core from '@alicloud/pop-core'

export default class AliyunVolumeNotificationUtil {
  static async singleCallByTts(calledNumber: string, ttsParam: string) {
    var client = new Core({
      accessKeyId: 'LTAI4FspEG2Ws8EczdTY7AsY',
      accessKeySecret: 'nK4rGNJuTDmPcAQUdTLokZ1w7p1ebD',
      endpoint: 'https://dyvmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    })

    var params = {
      RegionId: 'cn-hangzhou',
      CalledShowNumber: '051068794549',
      CalledNumber: calledNumber,
      TtsCode: 'TTS_181864195',
      TtsParam: ttsParam
    }

    var requestOption = {
      method: 'POST'
    }

    return client.request('SingleCallByTts', params, requestOption)
  }
}
