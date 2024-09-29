import { EmitterGateway, EventMapDAO, type Handler, IdentityGateway, IdentityRequestedCreated } from '@/infrastructure'
import { CreateDoctor } from '@/usecases'

export const IdentityRequestedCreated = (): Handler => {
  const DAO = new EventMapDAO()
  const gateway = new IdentityGateway()
  const emitter = new EmitterGateway()
  const usecase = new CreateDoctor(DAO, gateway, gateway, gateway, emitter)
  return new IdentityRequestedCreated(usecase)
}
