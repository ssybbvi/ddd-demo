import ossAliyun from 'ali-oss'
import * as fs from 'fs'

let client = new ossAliyun({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI4FtmLY3CAR639p3otxJX',
  accessKeySecret: 'zgbVP5Il45Z4nJROIHe8HQ968zRvAv',
  bucket: 'xiaoailingdong'
});

let stream = fs.createReadStream(`C:/Users/86186/AppData/Local/Temp/upload_844bce54f359f742abcafbcfa265cec1`)
client.putStream('/JiFen-ZhuanLe/images/commodity/xxxx.png', stream).then(() => {
  console.log("okokokok")
}).catch((error) => {
  console.log("errorerror", error)
})