import {AuthService} from "./AuthService.ts";

export class DataService {

  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService
  }

  public async createSpace(name: string, location: string, photo?: File) {
    const credantions = await this.authService.getTemporaryCredentials()
    console.log("=>(DataService.tsx:13) credantions", credantions);

    return '123'
  }

  public isAuthorized() {
    return true;
  }
}
