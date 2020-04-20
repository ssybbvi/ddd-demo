import { assert } from 'chai';
import { createThirdPartyAppUseCase } from "../../../src/modules/oauth2/useCases/thirdPartyApp/createThirdPartyApp"


describe("创建第三方应用：createThirdPartyAppUseCase", async () => {
  const thirdPartyAppName = "第三方应用名称"
  const createThirdPartyAppUseCaseResult = await createThirdPartyAppUseCase.execute({
    name: thirdPartyAppName
  })

  if (createThirdPartyAppUseCaseResult.isLeft()) {
    assert.throw(() => { }, createThirdPartyAppUseCaseResult.value.getValue().message)
  }
})