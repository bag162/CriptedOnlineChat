import { NgModule } from '@angular/core';
import { MessageListComponent } from './MessageListComponent/Message.list.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ContactListComponent } from './ContactListComponent/contact.list.component';
import { HomeComponent } from './home.component';


@NgModule({
  declarations: [
    ContactListComponent,
    MessageListComponent,
    HomeComponent
  ],
  imports: [
    FormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [],
  exports: [
  ]
})
export class HomeAppModule { }