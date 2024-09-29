import { Presenter } from '@/infrastructure'
import { ServerError, NotFound, type IHTTPResponse } from '@/infrastructure'

describe('Presenter', () => {
  test('should return 200 status code and correct body when ok is called', () => {
    const data = { success: true }
    const response: IHTTPResponse = Presenter.ok(data)
    expect(response).toEqual({
      statusCode: 200,
      body: data
    })
  })

  test('should return 204 status code and null body when noContent is called', () => {
    const response: IHTTPResponse = Presenter.noContent()
    expect(response).toEqual({
      statusCode: 204,
      body: null
    })
  })

  test('should return 201 status code and null body when created is called', () => {
    const response: IHTTPResponse = Presenter.created()
    expect(response).toEqual({
      statusCode: 201,
      body: null
    })
  })

  test('should return 400 status code and correct error when badRequest is called', () => {
    const error = new Error('Invalid request')
    const response: IHTTPResponse = Presenter.badRequest(error)
    expect(response).toEqual({
      statusCode: 400,
      body: error
    })
  })

  test('should return 404 status code and NotFound error when notFound is called', () => {
    const response: IHTTPResponse = Presenter.notFound()
    expect(response).toEqual({
      statusCode: 404,
      body: new NotFound()
    })
  })

  test('should return 500 status code and ServerError when serverError is called', () => {
    const error = new Error('Internal server error')
    const response: IHTTPResponse = Presenter.serverError(error)
    expect(response).toEqual({
      statusCode: 500,
      body: new ServerError(error.stack)
    })
  })
})
