import axios from 'axios'
import clc from 'cli-color'

export interface IHTTPClientRequest {
  method: METHOD
  url: string
  headers?: any
  params?: any
  data?: any
  responseType?: any
}

export interface IHTTPClientResponse<T> {
  data: T
  status: number
  statusText: string
  headers: any
  config: any
  request?: any
}

export enum METHOD {
  PATCH = 'patch',
  POST = 'post',
  PUT = 'put',
  GET = 'get',
  DELETE = 'delete'
}

export const adaptRequest = async <T = any> ({ method, url, params, data, headers }: IHTTPClientRequest): Promise<IHTTPClientResponse<T>> => {
  const response = await axios.request<T>({ method, url, params, data, headers })

  const statusCodeColor = (statusCode: string): any => {
    if (statusCode.startsWith('2')) return clc.green(statusCode)
    if (statusCode.startsWith('4') || statusCode.startsWith('5')) return clc.red(statusCode)
    return clc.yellow(statusCode)
  }
  process.stdout.write(`
    \r${clc.blue('Date:')} ${clc.blackBright(new Date().toLocaleString())}
    \r${clc.blue('Status code:')} ${statusCodeColor(response.status.toString())}
    \r${clc.blue('Method:')} ${clc.blackBright(method)}
    \r${clc.blue('Host')} ${clc.blackBright(url)}
    \r${clc.blue('URL')} ${clc.blackBright(url)}
    \r${clc.blue('HTTP Params:')} ${clc.blackBright(JSON.stringify(params))}
    \r${clc.blue('Headers:')} ${clc.blackBright(JSON.stringify(headers))}
    \r${clc.blue('Request Body:')} ${clc.white(JSON.stringify(data))}
    \r${clc.blue('Response Body:')} ${clc.white(JSON.stringify(response.data)
  )}
  `)
  return response
}
