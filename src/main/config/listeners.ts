import { type IBrokerAdapter } from '@/main/adapters'
import { identityRequestedHandler } from '../factories/handlers/identityRequestedHandler'

export default async (broker: IBrokerAdapter): Promise<void> => {
  await broker.subscribe('business-partner-identity-requested', identityRequestedHandler())
}
