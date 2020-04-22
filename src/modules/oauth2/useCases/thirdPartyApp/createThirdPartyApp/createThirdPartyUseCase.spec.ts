import { createThirdPartyAppUseCase } from "."

describe("创建第三方应用：createThirdPartyAppUseCase", async () => {
  test("xxx", async () => {
    const thirdPartyAppName = "第三方应用名称"
    const createThirdPartyAppUseCaseResult = await createThirdPartyAppUseCase.execute({
      name: thirdPartyAppName
    })

    expect(createThirdPartyAppUseCaseResult.isLeft()).toEqual(false)
  })

})