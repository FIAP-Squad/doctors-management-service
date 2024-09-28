import { EventMapDAO, IdentityGateway, type IController, LogErrorDAO, SignInController } from '@/infrastructure'
import { LogControllerDecorator } from '@/main/decorators'
import { makeSignInValidation } from '@/main/factories/validations'
import { SignIn } from '@/usecases'

export const makeSignInController = (): IController => {
  const DAO = new EventMapDAO()
  const logger = new LogErrorDAO()
  const gateway = new IdentityGateway()
  const validation = makeSignInValidation()
  const usecase = new SignIn(DAO, gateway)
  const controller = new SignInController(validation, usecase)
  return new LogControllerDecorator(controller, logger)
}
