import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { db, User } from 'src/db';
import { RSAService } from 'src/app/Services/rsa';
import { inject } from '@angular/core/testing';
import { RegisterUserDTO, UserService } from '../Services/user.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'register-user-component',
    templateUrl: 'registerUserComponent.html',
    providers: []
})

export class RegisterUserComponent {
    public registerUser: RegisterUserDTO;
    public userService: UserService;
    private router: Router;
    constructor(registerUser: RegisterUserDTO, userService: UserService,
        router: Router) {
        this.registerUser = registerUser;
        this.userService = userService;
        this.router = router;
    }

    public async registerNewUser()
    {
        if (this.registerUser.password != this.registerUser.repeatPassword) {
            $('.invalidMessage').text("Password mismatch");
            $('.form-control').addClass('is-invalid');
            return;
        }
        var result = await this.userService.RegisterUser(this.registerUser);

        if (result == "true") {
            this.router.navigate(['']);
        }
        else
        {
            $(".form-control").addClass("is-invalid");
            $('.invalidMessage').text(result);
        }
    }

    public deleteErrorNotify()
    {
        $(".form-control").removeClass("is-invalid");
    }
    public redirectToLoginPage()
    {
        this.router.navigate(['login']);
    }


    // public async DisplayNotify(resultRequest: string) {
    //     if (resultRequest == "true") { // TODO добавить сразу в localDB
    //         await db.User.add(await this.currentUser, 0);
    //         console.log(resultRequest + "true")
    //         $("#inputLogin").prop("disabled", true);
    //         $("#sendButton").hide();

    //         $("#succesNotify").show(500);
    //         setTimeout(() => {
    //             $("#succesNotify").hide(500)
    //         }, 2500);
    //     }
    //     else {
    //         console.log(resultRequest + "false")
    //         $("#dangerNotify").show(500);
    //         setTimeout(() => {
    //             $("#dangerNotify").hide(500)
    //         }, 2500);
    //     }
    // }
}