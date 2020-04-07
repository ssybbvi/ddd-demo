import { BindingPhoneNumberUseCase } from './bindingPhoneNumberUseCase'
import { BindingPhoneNumberController } from './bindingPhoneNumberController'
import { wxUserRepo } from '../../../repos'

const bindingPhoneNumberUseCase = new BindingPhoneNumberUseCase(wxUserRepo)
const bindingPhoneNumberController = new BindingPhoneNumberController(bindingPhoneNumberUseCase)

export { bindingPhoneNumberUseCase, bindingPhoneNumberController }
