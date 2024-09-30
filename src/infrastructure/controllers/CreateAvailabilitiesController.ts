import { type IHTTPResponse, type Controller, type IHTTPRequest, Presenter, type IValidation } from '@/infrastructure'
import { type ICreateAvailabilities } from '@/usecases'

export class CreateAvailabilitiesController implements Controller {
  constructor (
    private readonly _validation: IValidation,
    private readonly _usecase: ICreateAvailabilities
  ) { }

  async handle ({ body }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate(body)
      if (error) return Presenter.badRequest(error)
      const { doctorId, availabilities } = body
      await this._usecase.execute({ doctorId, availabilities })
      return Presenter.created()
    } catch (error) {
      return Presenter.serverError(error)
    }
  }
}
