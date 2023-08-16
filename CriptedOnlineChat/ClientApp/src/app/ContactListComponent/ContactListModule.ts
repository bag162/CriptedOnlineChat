import { FormsModule } from "@angular/forms";
import { RegisterUserComponent } from "./RegisterUserComponent/registerUserComponent";
import { ContactListComponent } from "./contact.list.component";
import { NgModule } from '@angular/core';
import { RSAService } from "../rsa";

@NgModule({
  declarations: [
    ContactListComponent,
    RegisterUserComponent
  ],
  imports:[FormsModule
  ],
  providers: [RSAService],
  bootstrap: [],
  exports: [ContactListComponent]
})
export class ContactListModule { }
