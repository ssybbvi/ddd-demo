import { commodityCache } from "../cache";

function commodityIdToDto(key: string = "commodityId") {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let oldFunc = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      var result = await oldFunc.apply(this, args);
      try {
        let id = result[key]
        let dto = await commodityCache.getValue(id)
        console.log("dto", id, dto)
        let { name, amount, description, images, fakeAmount, sales, restrictedPurchaseQuantity, limitedPurchasePerPerson, tags, imgesDescrptionList, type } = dto
        return {
          commodityName: name,
          commodityDescription: description,
          commodityImages: images,
          commodityFakeAmount: fakeAmount,
          commoditySales: sales,
          commodityRestrictedPurchaseQuantity: restrictedPurchaseQuantity,
          commodityLimitedPurchasePerPerson: limitedPurchasePerPerson,
          commodityTags: tags,
          commodityImgesDescrptionList: imgesDescrptionList,
          commodityType: type,
          commodityAmount: amount,

          ...result
        }
      } catch (err) {
        console.log("commodityIdToDto", err, result)
        return result
      }
    }
  }
}


export { commodityIdToDto }
