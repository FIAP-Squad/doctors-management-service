import { type IHTTPResponse } from '@/infrastructure'

export interface Controller<T = any> {
  handle: (request: T) => Promise<IHTTPResponse>
}
