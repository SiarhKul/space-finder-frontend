import {type CognitoUser} from "@aws-amplify/auth"
import {Amplify, Auth} from 'aws-amplify'
import {AuthCognitoStack as AuthStack} from '../../../space-finder/outputs.json'
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

const awsRegion = 'eu-central-1'

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: awsRegion,
    userPoolId: AuthStack.SpaceUserPoolId,
    userPoolWebClientId: AuthStack.SpaceUserPoolClientId,
    identityPoolId: AuthStack.SpaceIdentityPoolId,
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  }
});

export class AuthService {
  private user: CognitoUser | undefined;
  public jwtToken: string | undefined;
  private temporaryCredentials: object | undefined

  public async login(userName: string, password: string): Promise<object | undefined> {
    try {
      this.user = await Auth.signIn(userName, password) as CognitoUser;
      this.jwtToken = this.user.getSignInUserSession()?.getIdToken().getJwtToken()

      return this.user;
    } catch (error) {
      console.error(error);
      return undefined
    }
  }

  public getUserName() {
    return this.user?.getUsername();
  }

  public async getTemporaryCredentials() {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials
    }

    this.temporaryCredentials = await this.generateTemporaryCredentials()
    return this.temporaryCredentials
  }

  private async generateTemporaryCredentials() {
    const cognitoIdentityPool: string = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`

    const cognitoIdentity: CognitoIdentityClient = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion
        },
        identityPoolId: AuthStack.SpaceIdentityPoolId,
        logins: {
          [cognitoIdentityPool]: this.jwtToken!
        }
      })

    })
    const credantions = await cognitoIdentity.config.credentials()
    return credantions
  }
}
