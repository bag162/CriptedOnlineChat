import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class AuthorizeGuardService {
  private httpClient: HttpClient;
  public baseUrl: string;
  constructor(httpclient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = httpclient;
    this.baseUrl = baseUrl + "";
  }

  public async IsAuthorized(): Promise<boolean> {
    return await this.httpClient.get(this.baseUrl + "user/IsAuthenticated").toPromise().then(response => {
      return <boolean>response;
    })
  }
}