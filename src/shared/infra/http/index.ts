import { Middleware } from './utils/Middleware'
import { authService } from '../auth'

const middleware = new Middleware(authService)

export { middleware }
