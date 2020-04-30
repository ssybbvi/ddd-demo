import { wxUserCache } from "../cache";


function userIdToDto(key: string = "userId") {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let oldFunc = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      var result = await oldFunc.apply(this, args);
      try {
        let userId = result[key]
        let userDto = await wxUserCache.getValue(userId)
        let { nickName, avatarUrl, gender, phoneNumber } = userDto
        return {
          wxUserNickName: nickName,
          wxUserAvatarUrl: avatarUrl,
          wxUserGender: gender,
          wxUserPhoneNumber: phoneNumber,
          ...result
        }
      } catch (err) {
        console.log("userIdToWxUserDto", err)
        return result
      }
    }
  }
}


export {
  userIdToDto
}
