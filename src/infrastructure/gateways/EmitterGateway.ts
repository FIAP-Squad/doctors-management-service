import { brokerClient } from '@/main/adapters'

export interface IEmitterGateway {
  publish: ({ queue, message }) => Promise<void>
}

export class EmitterGateway implements IEmitterGateway {
  async publish ({ queue, message }): Promise<void> {
    await brokerClient.publish({ queue, message })
  }
}
