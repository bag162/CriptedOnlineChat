import { Component, Inject, OnInit } from '@angular/core';
import { UserService, LoginUserDTO } from '../Services/user.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'login-user-component',
    templateUrl: 'loginUserComponent.html',
    styleUrls: ['loginUserComponent.css'],
    providers: [],
    
})

export class LoginUserComponent {
    public userLoginDTO: LoginUserDTO;
    private userService: UserService;
    private router: Router;

    constructor(userLoginDTO: LoginUserDTO, userService: UserService,
        router: Router) {
        this.userLoginDTO = userLoginDTO;
        this.userService = userService;
        this.router = router;
    }

    public async loginUser() //TODO получить и установить в базу данные о пользователе
    {
        var result = await this.userService.LoginUser(this.userLoginDTO);
        if (result) {
            this.router.navigate(['']);
        }
        else
        {
            $(".form-control").addClass("is-invalid");
        }
    }

    deleteErrorNotify()
    {
        $(".form-control").removeClass("is-invalid");
    }

    public redirectToRegisterPage()
    {
        this.router.navigate(['registration']);
    }
}


