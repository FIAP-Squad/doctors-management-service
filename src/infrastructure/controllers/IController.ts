import { type IHTTPResponse } from '@/infrastructure'

export interface IController<T = any> {
  handle: (request: T) => Promise<IHTTPResponse>
}
