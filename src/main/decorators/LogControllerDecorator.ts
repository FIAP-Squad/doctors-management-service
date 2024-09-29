import {
  type Controller,
  type IHTTPRequest,
  type IHTTPResponse,
  type ILogErrorDAO
} from '@/infrastructure'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly _controller: Controller,
    private readonly _DAO: ILogErrorDAO
  ) { }

  async handle (request: IHTTPRequest): Promise<IHTTPResponse> {
    const response = await this._controller.handle(request)
    if (response.statusCode === 500) await this._DAO.logError(response.body.stack)
    return response
  }
}
