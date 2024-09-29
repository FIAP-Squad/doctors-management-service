import {
  ServerError,
  NotFound,
  type IHTTPResponse
} from '@/infrastructure'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Presenter {
  static ok (data: any): IHTTPResponse {
    return {
      statusCode: 200,
      body: data
    }
  }

  static noContent (): IHTTPResponse {
    return {
      statusCode: 204,
      body: null
    }
  }

  static created (): IHTTPResponse {
    return {
      statusCode: 201,
      body: null
    }
  }

  static badRequest (error: Error): IHTTPResponse {
    return {
      statusCode: 400,
      body: error
    }
  }

  static notFound (): IHTTPResponse {
    return {
      statusCode: 404,
      body: new NotFound()
    }
  }

  static unauthorized (): IHTTPResponse {
    return {
      statusCode: 401,
      body: null
    }
  }

  static serverError (error: Error): IHTTPResponse {
    return {
      statusCode: 500,
      body: new ServerError(error.stack)
    }
  }
}
