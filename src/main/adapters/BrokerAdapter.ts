import amqp, { type Channel, type Connection } from 'amqplib'
import env from '@/main/config/env'
import { type Handler } from '@/infrastructure'

export interface IBrokerAdapter {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  subscribe: (queue: string, handle: Handler) => Promise<void>
  publish: ({ queue, message }) => Promise<void>
  run: () => Promise<void>
}

export class BrokerClient implements IBrokerAdapter {
  private connection!: Connection
  private channel!: Channel
  private readonly _PROTOCOL: string = env.RABBITMQ.PROTOCOL
  private readonly _HOST: string = env.RABBITMQ.HOST_NAME
  private readonly _PORT: number = Number.parseInt(env.RABBITMQ.PORT)
  private readonly _USERNAME: string = env.RABBITMQ.USERNAME
  private readonly _PASSWORD: string = env.RABBITMQ.PASSWORD
  private readonly handlers: Map<string, Handler> = new Map<string, Handler>()

  async connect (): Promise<void> {
    this.connection = await amqp.connect({
      protocol: this._PROTOCOL,
      hostname: this._HOST,
      port: this._PORT,
      username: this._USERNAME,
      password: this._PASSWORD
    })
    this.channel = await this.connection.createChannel()
  }

  async disconnect (): Promise<void> {
    await this.channel.close()
    await this.connection.close()
  }

  async subscribe (queue: string, handler: Handler): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true })
    this.handlers.set(queue, handler)
  }

  async publish ({ queue, message }): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true })
    const messageContent = JSON.stringify(message)
    this.channel.sendToQueue(queue, Buffer.from(messageContent))
    console.log(`Message sended through queue: ${queue}: ${messageContent}`)
  }

  async run (): Promise<void> {
    for (const [queue, handler] of this.handlers.entries()) {
      await this.channel.consume(queue, async (message: any) => {
        if (message) {
          const messageContent = message.content.toString()
          console.log(`Message received through queue: ${queue}: ${messageContent}`)
          const parsedMessage = JSON.parse(messageContent)
          await handler.handle(parsedMessage)
          this.channel.ack(message)
        }
      })
    }
  }
}

export const brokerClient = new BrokerClient()
