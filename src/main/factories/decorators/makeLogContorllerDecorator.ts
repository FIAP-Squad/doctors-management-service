import { LogErrorDAO, type IController } from '@/infrastructure'
import { LogControllerDecorator } from '@/main/decorators'

export const makeLogControllerDecorator = (controller: IController): IController => {
  const logRepository = new LogErrorDAO()
  return new LogControllerDecorator(controller, logRepository)
}
