import { type ICreateDoctor } from '@/usecases'
import { type Handler } from '@/infrastructure'

export class IdentityRequestedCreated implements Handler {
  constructor (private readonly _usecase: ICreateDoctor) { }
  async handle (event: any): Promise<void> {
    try {
      await this._usecase.execute(JSON.parse(event))
    } catch (error) {
      process.stdout.write(`Error: ${error.message}, Stack: ${error.stack}`)
    }
  }
}
