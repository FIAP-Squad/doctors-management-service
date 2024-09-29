import { type IHTTPResponse, type Controller, type IHTTPRequest, Presenter } from '@/infrastructure'
import { type ILoadDoctor } from '@/usecases'

export class LoadDoctorController implements Controller {
  constructor (private readonly _usecase: ILoadDoctor) { }
  async handle ({ query }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const doctors = await this._usecase.execute(query)
      return Presenter.ok(doctors)
    } catch (error) {
      return Presenter.serverError(error)
    }
  }
}
