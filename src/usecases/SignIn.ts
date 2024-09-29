import { type AuthenticationResult, type IEventMapDAO, type ISignInGateway } from '@/infrastructure'

export type SignInParams = {
  email: string
  password: string
  type: string
}

export interface ISignIn {
  execute: (params: SignInParams) => Promise<AuthenticationResult>
}

export class SignIn implements ISignIn {
  constructor (
    private readonly _DAO: IEventMapDAO,
    private readonly _gateway: ISignInGateway
  ) { }

  async execute ({ email, password, type }: SignInParams): Promise<AuthenticationResult> {
    const identityProperties = await this._DAO.load(type)
    if (identityProperties?.clientId) {
      const token = await this._gateway.signin({ clientId: identityProperties.clientId, username: email, password })
      return token
    }
    return null
  }
}
