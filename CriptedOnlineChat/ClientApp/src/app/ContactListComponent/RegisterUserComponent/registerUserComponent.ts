import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { db, User } from 'src/db';
import { RSAService } from 'src/app/rsa';
declare var $: any;

@Component({
    selector: 'register-user-component',
    templateUrl: 'registerUserComponent.html',
    providers: [RSAService]
})

export class RegisterUserComponent implements OnInit {
    httpClient: any;
    rsaService: RSAService;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string, rsaService: RSAService) {
        this.baseUrl = baseUrl;
        this.rsaService = rsaService;
        this.currentUser = { Login: "" };
    }

    async ngOnInit() {
        var user = await db.User.toArray();
        if (user.length != 0) {
            console.log("Пользователь зарегестрирован")
            this.currentUser = user[0];
            $("#inputLogin").prop("disabled", true);
            $("#sendButton").hide();
        }
        (await this.rsaService.GenerateKeyPairs().then(x => console.log(x)));

    }
    public baseUrl: string;
    public currentUser: User;

    public async RegisterUser() {
        if (this.currentUser.Login == "") {
            // add notify
            return;
        }
        await this.http.post<string>(this.baseUrl + "user", this.currentUser).subscribe(result => this.DisplayNotify(result));
        return;
    }

    public async DisplayNotify(resultRequest: string) {
        if (resultRequest == "true") {
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