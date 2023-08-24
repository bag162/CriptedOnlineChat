import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { db, User } from 'src/db';
import { RSAService } from 'src/app/Services/rsa';
import { inject } from '@angular/core/testing';
declare var $: any;

@Component({
    selector: 'register-user-component',
    templateUrl: 'registerUserComponent.html',
    providers: []
})

export class RegisterUserComponent implements OnInit {
    public baseUrl: string;
    public currentUser: User = { Login: "" };
    httpClient: any;
    rsaService: RSAService;

    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, rsaService: RSAService) {
        this.baseUrl = baseUrl;
        this.rsaService = rsaService;
    }

    async ngOnInit() {
        var user = await db.User.toArray();
        if (user.length != 0) {
            this.currentUser = user[0];
            $("#inputLogin").prop("disabled", true);
            $("#sendButton").hide();
        }
    }

    public async RegisterUser() {
        if (this.currentUser.Login == "") {
            // TODO add notify
            return;
        }
        await this.http.post<string>(this.baseUrl + "user", this.currentUser).subscribe(result => this.DisplayNotify(result));
        return;
    }

    public async DisplayNotify(resultRequest: string) {
        if (resultRequest == "true") { // TODO добавить сразу в localDB
            await db.User.add(await this.currentUser, 0);
            console.log(resultRequest + "true")
            $("#inputLogin").prop("disabled", true);
            $("#sendButton").hide();

            $("#succesNotify").show(500);
            setTimeout(() => {
                $("#succesNotify").hide(500)
            }, 2500);
        }
        else {
            console.log(resultRequest + "false")
            $("#dangerNotify").show(500);
            setTimeout(() => {
                $("#dangerNotify").hide(500)
            }, 2500);
        }
    }
}