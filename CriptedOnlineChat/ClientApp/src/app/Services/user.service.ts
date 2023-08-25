import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UserService {
    private httpClient: HttpClient;
    private baseUrl: string;

    constructor(httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.httpClient = httpClient;
        this.baseUrl = baseUrl;

    }


    public async LoginUser(userToLogin: LoginUserDTO): Promise<boolean> {
        return await this.httpClient.post(this.baseUrl + "user/Login", userToLogin).toPromise().then(response => {
            return <boolean>response;
        })
    }

    public async RegisterUser(registerUserDTO: RegisterUserDTO) : Promise<string>
    {
        var result = await this.httpClient.post(this.baseUrl + "user/registration", registerUserDTO, {responseType: 'text'}).toPromise();
        return result;
    }

    public async FindUsers(findedUser: FindUserDTO) : Promise<string[]>
    {
        var result = await this.httpClient.post(this.baseUrl + "user/FindUser", findedUser).toPromise();
        console.log(result)
        return <string[]>result;
    }


    

}
@Injectable({ providedIn: 'root' })
export class LoginUserDTO {
    login: string = "";
    password: string = "";
    isPersistent: boolean = false;
}

@Injectable({ providedIn: 'root' })
export class RegisterUserDTO {
    login: string = "";
    password: string = "";
    repeatPassword: string = "";
    isPersistent: boolean = false;
}

@Injectable({ providedIn: 'root' })
export class FindUserDTO {
    login: string = "";
}