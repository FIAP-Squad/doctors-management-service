import {
  type ISignUpGateway,
  type IEventMapDAO,
  type IEmitterGateway,
  type IUpdateEntityPasswordGateway,
  type IDeleteGateway

} from '@/infrastructure'

export interface ICreateBusinessPartner {
  execute: (params: IdentityProperties) => Promise<void>
}

export type IdentityProperties = {
  type: string
  email: string
  password: string
  customAttributes?: Record<any, any>
}

export class CreateBusinessPartner implements ICreateBusinessPartner {
  constructor (
    private readonly _DAO: IEventMapDAO,
    private readonly _signup: ISignUpGateway,
    private readonly _update: IUpdateEntityPasswordGateway,
    private readonly _delete: IDeleteGateway,
    private readonly _emitter: IEmitterGateway
  ) { }

  async execute ({ type, email, password, customAttributes }: IdentityProperties): Promise<void> {
    const properties = await this._DAO.load(type)

    if (properties) {
      const { queue, userPoolId } = properties
      const { User } = await this._signup.signup({ userPoolId, username: email, email, password, customAttributes })
      if (User?.Attributes) {
        try {
          await this._update.updatePassword({ userPoolId, username: email, password })
        } catch (error) {
          await this._delete.delete({ userPoolId, username: email })
          await this._emitter.publish({ queue: `${queue}-error`, message: error })
        }
        await this._emitter.publish({
          queue,
          message: {
            type,
            properties: {
              email,
              customAttributes
            }
          }
        })
      }
    }
  }
}
