import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthorizeGuardService } from "../Services/authorizeGuard.service";

@Injectable({providedIn: 'root'})
  export class AuthorizeGuard implements CanActivate {
    private router: Router;
    private authorizeGuardService: AuthorizeGuardService;

    constructor(router: Router, authorizeGuardService: AuthorizeGuardService) {
        this.authorizeGuardService = authorizeGuardService;
        this.router = router;
    }

    canActivate(
      _next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        var result = this.authorizeGuardService.IsAuthorized();
        result.then(res => this.handleAuthorization(res));
        return result;
    }

    private handleAuthorization(isAuthenticated: boolean) {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      }
  }