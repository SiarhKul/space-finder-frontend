export class AuthService {
  public async login(userName: string, password: string): Promise<object | undefined> {
    console.log({userName, password});
    return {
      user: ''
    }
  }


  public getUserName() {
    return "some user"
  }
}
