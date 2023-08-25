import { Component } from '@angular/core';
import { AppDB, Contact } from 'src/db';
import { DataService } from '../../Services/DataService';
import { Timestamp } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FindUserDTO, UserService } from 'src/app/Services/user.service';
declare var $: any;

@Component({
  selector: 'contact-list-component',
  templateUrl: './contact.list.component.html',
  styleUrls: ['./contact.list.component.css']
})
export class ContactListComponent {
  // Services
  public DataService: DataService;
  public userService: UserService;
  public contactList: Contact[] = [];
  private db: AppDB;

  // Search variables
  public searchUserLogin: FindUserDTO = new FindUserDTO();

  constructor(db: AppDB, DataService: DataService, userService: UserService) {
    this.db = db;
    this.DataService = DataService;
    this.userService = userService;
  }

  async ngOnInit() {
    this.contactList = await this.db.Contacts.toArray();
  }

  ChangeDisplayedMessages(newDesplayedUserLogin: string) {
    this.DataService.currentDisplayedLogin.next(newDesplayedUserLogin);
  }

  async searchUsers() {
    if (this.searchUserLogin.login == "") {
      return
    }
    let findedUsers: string[] = await this.userService.FindUsers(this.searchUserLogin); // TODO take preloader

    let newDispayedUsers: Contact[] = [];
    findedUsers.forEach(element => {
      var newContact: Contact = {Login: element};
      newDispayedUsers.push(newContact);
    });
    $(".contactList").hide(1000);
    // this.contactList = newDispayedUsers;
    $(".contactList").show(1000);
  }
}
