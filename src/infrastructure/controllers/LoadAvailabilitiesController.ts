import { type IHTTPResponse, type Controller, type IHTTPRequest, Presenter } from '@/infrastructure'
import { type ILoadAvailabilities } from '@/usecases'

export class LoadAvailabilitiesController implements Controller {
  constructor (private readonly _usecase: ILoadAvailabilities) { }
  async handle ({ query }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const doctors = await this._usecase.execute(query)
      return Presenter.ok(doctors)
    } catch (error) {
      return Presenter.serverError(error)
    }
  }
}
