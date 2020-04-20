import crypto from 'crypto'

export class CryptoUtils {
  public static md5(str: string) {
    return crypto.createHash('md5').update(str).digest('base64');
  }
}
