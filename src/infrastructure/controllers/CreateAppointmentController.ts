import { type IHTTPResponse, type Controller, type IHTTPRequest, Presenter, type IValidation } from '@/infrastructure'
import { type ICreateAppointment } from '@/usecases'

export class CreateAppointmentController implements Controller {
  constructor (
    private readonly _validation: IValidation,
    private readonly _usecase: ICreateAppointment
  ) { }

  async handle ({ body }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate(body)
      if (error) return Presenter.badRequest(error)
      const { doctorId, patientId, availabilityId } = body
      await this._usecase.execute({ doctorId, patientId, availabilityId })
      return Presenter.created()
    } catch (error) {
      return Presenter.serverError(error)
    }
  }
}
