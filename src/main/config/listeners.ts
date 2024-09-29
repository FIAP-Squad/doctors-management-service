import { type IBrokerAdapter } from '@/main/adapters'
import { IdentityRequestedCreated } from '../factories/handlers/IdentityRequestedCreated'

export default async (broker: IBrokerAdapter): Promise<void> => {
  await broker.subscribe('business-partner-identity-requested', IdentityRequestedCreated())
}
