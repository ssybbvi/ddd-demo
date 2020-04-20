const crypto = require('crypto');
function md5 (data) {
  // 以md5的格式创建一个哈希值
  return crypto.createHash('md5').update(data).digest('base64');
}
let mima = md5('dandan')
console.log(mima)