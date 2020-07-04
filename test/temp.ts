export interface IAttributeDto {
  _id: string
  name: string
  specifications: ISpecificationDto[]
}
export interface ISpecificationDto {
  _id: string
  name: string
  icon: string
}

export interface ISkuDto {
  _id: string
  name: string
  code: string
  price: number
  stock: number
  isSufficient: boolean
  combines: ISkuSpecificationDto[]
}

export interface ISkuSpecificationDto {
  attributeId: string
  specificationId: string
}

const attributeList: IAttributeDto[] = []
attributeList.push({
  _id: '颜色',
  name: '颜色',
  specifications: [
    {
      _id: 'xxx1yyy1',
      name: '黄色',
      icon: 'xxx1yyy1',
    },
    {
      _id: 'xxx1yyy1',
      name: '绿色',
      icon: 'xxx1yyy1',
    },
  ],
})

attributeList.push({
  _id: '尺寸',
  name: '尺寸',
  specifications: [
    {
      _id: 'xxx1yyy1',
      name: 'XXL',
      icon: 'xxx1yyy1',
    },
    {
      _id: 'xxx1yyy1',
      name: 'XL',
      icon: 'xxx1yyy1',
    },
    // {
    //   _id: 'xxx1yyy1',
    //   name: 'L',
    //   icon: 'xxx1yyy1',
    // },
  ],
})

// attributeList.push({
//   _id: '大小',
//   name: '大小',
//   specifications: [
//     {
//       _id: 'xxx1yyy1',
//       name: '128',
//       icon: 'xxx1yyy1',
//     },
//     {
//       _id: 'xxx1yyy1',
//       name: '256',
//       icon: 'xxx1yyy1',
//     },
//     {
//       _id: 'xxx1yyy1',
//       name: '512',
//       icon: 'xxx1yyy1',
//     },
//     {
//       _id: 'xxx1yyy1',
//       name: '1024',
//       icon: 'xxx1yyy1',
//     },
//   ],
// })

// const resultLength = attributeList.reduce((acc, item) => (acc *= item.specifications.length), 1)
// const result: ISkuSpecificationDto[][] = []
// for (let i = 0; i < resultLength; i++) {
//   result.push([])
// }

// attributeList.forEach((item) => {
//   let fillTotal = result.length / item.specifications.length

//   item.specifications.forEach((childItem, index) => {
//     let targetList = result.slice(index * fillTotal, (index + 1) * fillTotal)

//     targetList.forEach((targetItem) => {
//       targetItem.push({ attributeId: item._id, specificationId: childItem.name })
//     })
//   })
// })

let result: ISkuSpecificationDto[][] = []
attributeList.forEach((attributeItem) => {
  const specificationList = attributeItem.specifications
  if (result.length === 0) {
    result = specificationList.map((item) => [{ attributeId: item._id, specificationId: attributeItem.name }])
  } else {
    let newReuslt = []
    result.forEach((item) => {
      specificationList.forEach((specificationItem) => {
        const xx = result.push()
        newReuslt.push({})
      })
    })
  }
})

console.log('result', result, result.length)
