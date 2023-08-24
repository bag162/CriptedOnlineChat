import { Injectable } from "@angular/core";

Injectable({providedIn: 'root'})
  export class AuthorizeGuardService{
    public IsAuthorized() : Promise<boolean>
    {
        return Promise.resolve<boolean>(true); //TODO сделать запрос на сервер авторизован ли пользователь по кукам
    }
  }