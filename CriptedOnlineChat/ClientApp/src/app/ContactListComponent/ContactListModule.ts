import { FormsModule } from "@angular/forms";
import { RegisterUserComponent } from "./RegisterUserComponent/registerUserComponent";
import { ContactListComponent } from "./contact.list.component";
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ContactListComponent,
    RegisterUserComponent
  ],
  imports:[FormsModule
    
  ],
  providers: [],
  bootstrap: [],
  exports: [ContactListComponent]
})
export class ContactListModule { }
