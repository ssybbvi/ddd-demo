import { RefreshSessionKeyUseCase } from './refreshSessionKeyUseCase'
import { wxUserRepo } from '../../../repos'

const refreshSessionKeyUseCase = new RefreshSessionKeyUseCase(wxUserRepo)

export { refreshSessionKeyUseCase }
