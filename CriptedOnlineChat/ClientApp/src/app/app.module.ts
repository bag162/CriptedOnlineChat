import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterUserComponent } from './RegisterUserComponent/registerUserComponent';
import { LoginUserComponent } from './LoginUserComponent/loginUserComponent';
import { AuthorizeGuard } from './api-authorize/authorize.guard';
import { HomeComponent } from './HomeComponent/home.component';
import { HomeAppModule } from './HomeComponent/homeApp.module';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


@NgModule({
  declarations: [
    AppComponent,
    RegisterUserComponent,
    LoginUserComponent,
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeComponent, canActivate: [AuthorizeGuard] },
      { path: 'login', component: LoginUserComponent },
      { path: 'registration', component: RegisterUserComponent }

    ]),
    HomeAppModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }