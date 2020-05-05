import { createThirdPartyAppUseCase } from '.'

test('创建第三方应用：createThirdPartyAppUseCase', async () => {
  const thirdPartyAppName = '第三方应用名称'
  const createThirdPartyAppUseCaseResult = await createThirdPartyAppUseCase.execute({
    name: thirdPartyAppName,
  })

  expect(createThirdPartyAppUseCaseResult.isLeft()).toEqual(false)
})
