import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AppDB, db, User } from 'src/db';
import { RSAService } from 'src/app/Services/rsa.service';
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
    public appDb: AppDB;
    private router: Router;

    constructor(registerUser: RegisterUserDTO, userService: UserService,
        router: Router, appDb: AppDB) {
        this.registerUser = registerUser;
        this.userService = userService;
        this.router = router;
        this.appDb = appDb;
    }
    
    public async registerNewUser()
    {
        if (this.registerUser.password != this.registerUser.repeatPassword) {
            $('.invalidMessage').text("Password mismatch");
            $('.form-control').addClass('is-invalid');
            return;
        }
        var result = await this.userService.RegisterUser(this.registerUser);

        if (result.isSuccess) {
            let newUser: User = {Login: result.login, id: result.id};
            this.appDb.User.add(newUser);
            this.router.navigate(['']);
        }
        else
        {
            $(".form-control").addClass("is-invalid");
            $('.invalidMessage').text(result.descriptionError);
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
}