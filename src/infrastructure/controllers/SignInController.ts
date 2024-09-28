import { type IHTTPResponse, type IController, type IValidation, type IHTTPRequest, Presenter } from '@/infrastructure'
import { type ISignIn } from '@/usecases'

export class SignInController implements IController {
  constructor (
    private readonly _validation: IValidation,
    private readonly _usecase: ISignIn
  ) { }

  async handle ({ body }: IHTTPRequest): Promise<IHTTPResponse> {
    try {
      const error = this._validation.validate(body)
      if (error) return Presenter.badRequest(error)
      const token = await this._usecase.execute(body)
      return Presenter.ok(token)
    } catch (error) {
      if (error?.name === 'NotAuthorizedException') return Presenter.unauthorized()
      return Presenter.serverError(error)
    }
  }
}
