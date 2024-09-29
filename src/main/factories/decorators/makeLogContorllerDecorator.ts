import { LogErrorDAO, type Controller } from '@/infrastructure'
import { LogControllerDecorator } from '@/main/decorators'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logRepository = new LogErrorDAO()
  return new LogControllerDecorator(controller, logRepository)
}
