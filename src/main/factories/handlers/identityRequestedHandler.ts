import { EmitterGateway, EventMapDAO, type IHandler, IdentityGateway, IdentityRequestedHandler } from '@/infrastructure'
import { CreateBusinessPartner } from '@/usecases'

export const identityRequestedHandler = (): IHandler => {
  const DAO = new EventMapDAO()
  const gateway = new IdentityGateway()
  const emitter = new EmitterGateway()
  const usecase = new CreateBusinessPartner(DAO, gateway, gateway, gateway, emitter)
  return new IdentityRequestedHandler(usecase)
}
