import env from '@/main/config/env'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class IdentitySingleton {
  private static instance: CognitoIdentityProviderClient

  private constructor () { }
  public static getInstance (): CognitoIdentityProviderClient {
    if (!IdentitySingleton.instance) {
      IdentitySingleton.instance = new CognitoIdentityProviderClient({
        credentials: { accessKeyId: env.AWS.ACCESS_KEY_ID, secretAccessKey: env.AWS.SECRET_ACCESS_KEY },
        region: 'us-east-1'
      })
    }
    return IdentitySingleton.instance
  }
}

export const identitySingleton = IdentitySingleton.getInstance()
