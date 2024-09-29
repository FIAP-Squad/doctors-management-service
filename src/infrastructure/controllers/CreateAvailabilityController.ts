import { type IHTTPResponse, type Controller, type IHTTPRequest, Presenter, type IValidation } from '@/infrastructure'
import { type ICreateAvailability } from '@/usecases'

export class CreateAvailabilityController implements Controller {
  constructor (
    private readonly _validation: IValidation,
    private readonly _usecase: ICreateAvailability
  ) { }

  async handle ({ body }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate(body)
      if (error) return Presenter.badRequest(error)
      const { email, date, startTime, endTime } = body
      await this._usecase.execute({ email, date, startTime, endTime })
      return Presenter.created()
    } catch (error) {
      return Presenter.serverError(error)
    }
  }
}
