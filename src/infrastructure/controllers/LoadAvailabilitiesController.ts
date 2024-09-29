import { Presenter, type IHTTPResponse, type Controller, type IHTTPRequest, type IValidation } from '@/infrastructure'
import { type ILoadAvailabilities } from '@/usecases'

export class LoadAvailabilitiesController implements Controller {
  constructor (
    private readonly _validation: IValidation,
    private readonly _usecase: ILoadAvailabilities
  ) { }

  async handle ({ params }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate(params)
      if (error) return Presenter.badRequest(error)
      const doctors = await this._usecase.execute(params.doctor)
      return Presenter.ok(doctors)
    } catch (error) {
      return Presenter.serverError(error)
    }
  }
}
