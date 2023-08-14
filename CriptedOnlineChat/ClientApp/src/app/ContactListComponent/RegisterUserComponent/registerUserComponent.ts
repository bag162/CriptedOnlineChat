import { HttpClient } from '@angular/common/http';
import { retagAllTsFiles } from '@angular/compiler-cli/src/ngtsc/shims';
import { Component, Inject, OnInit } from '@angular/core';
import { getBaseUrl } from 'src/main';

@Component({
    selector: 'register-user-component',
    templateUrl: 'registerUserComponent.html'
})

export class RegisterUserComponent implements OnInit {
    httpClient: any;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.registerUser = new registerUser;
        this.baseUrl = baseUrl;
    }

    ngOnInit() { }
    public baseUrl: string;
    public registerUser: registerUser;

    public CheckEmplyment() {
        if (this.registerUser.login == "") {
            // add notify
            return;
        }
        this.http.post(this.baseUrl + "user", this.registerUser).subscribe(result => console.log(result));
        return;
    }
}


class registerUser {
    constructor()
    {
        this.login = "";
    }
    public login: string;
}