import { type ICreateBusinessPartner } from '@/usecases'

export interface IHandler {
  handle: (event: any) => Promise<void>
}

export class IdentityRequestedHandler implements IHandler {
  constructor (private readonly _usecase: ICreateBusinessPartner) { }
  async handle (event: any): Promise<void> {
    try {
      await this._usecase.execute(JSON.parse(event))
    } catch (error) {
      process.stdout.write(`Error: ${error.message}, Stack: ${error.stack}`)
    }
  }
}
