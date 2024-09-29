import { type IHTTPResponse } from '@/infrastructure'

export interface IMiddleware<T = any> {
  handle: (request: T) => Promise<IHTTPResponse>
}
