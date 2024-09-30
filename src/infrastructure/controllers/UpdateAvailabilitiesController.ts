import { type IHTTPResponse, type Controller, type IHTTPRequest, Presenter, type IValidation } from '@/infrastructure'
import { type IUpdateAvailabilities } from '@/usecases'

export class UpdateAvailabilitiesController implements Controller {
  constructor (
    private readonly _validation: IValidation,
    private readonly _usecase: IUpdateAvailabilities
  ) { }

  async handle ({ params, body }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate({ ...params, ...body })
      if (error) return Presenter.badRequest(error)
      const { doctorId } = params
      const { availabilities } = body
      await this._usecase.execute({ doctorId, availabilities })
      return Presenter.created()
    } catch (error) {
      return Presenter.serverError(error)
    }
  }
}
