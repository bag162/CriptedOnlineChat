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

    public async RegisterUser(registerUserDTO: RegisterUserDTO) : Promise<FinishRegisterUserDTO>
    {
        var result = await this.httpClient.post<FinishRegisterUserDTO>(this.baseUrl + "user/registration", registerUserDTO).toPromise();
        return result;
    }

    public async FindUsers(findedUser: FindUserDTO) : Promise<FindUserDTO[]>
    {
        var result = await this.httpClient.post(this.baseUrl + "user/FindUser", findedUser).toPromise();
        return <FindUserDTO[]>result;
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
    id: string = "";
}

@Injectable({ providedIn: 'root' })
export class FinishRegisterUserDTO {
    isSuccess: boolean = false;
    descriptionError: string = "";
    id: string = "";
    login: string = "";
}