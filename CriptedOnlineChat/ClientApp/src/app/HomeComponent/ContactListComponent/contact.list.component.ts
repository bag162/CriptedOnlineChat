import { Component } from '@angular/core';
import { AppDB, Contact, PrivateKey, PublicKey } from 'src/db';
import { DataService } from '../../Services/data.service';
import { Timestamp } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FindUserDTO, UserService } from 'src/app/Services/user.service';
import { RSAService } from 'src/app/Services/rsa.service';
import { v4 as uuidv4 } from 'uuid';
import { ContactService } from 'src/app/Services/contacts.service';
import { RSAKeysService } from 'src/app/Services/rsa.keys.service';
declare var $: any;

@Component({
  selector: 'contact-list-component',
  templateUrl: './contact.list.component.html',
  styleUrls: ['./contact.list.component.css'],
})

export class ContactListComponent {
  // Services
  private rsaKeysService: RSAKeysService;
  public ContactService: ContactService;
  public DataService: DataService;
  public userService: UserService;
  public rsaService: RSAService;
  public contactList: Contact[] = [];
  private db: AppDB;

  // Search variables
  public searchUserLogin: FindUserDTO = new FindUserDTO();
  public isSearchMode: boolean = false;
  constructor(db: AppDB, DataService: DataService, userService: UserService, rsaService: RSAService, contactService: ContactService, rsaKeysService: RSAKeysService) {
    this.db = db;
    this.DataService = DataService;
    this.userService = userService;
    this.rsaService = rsaService;
    this.ContactService = contactService;
    this.rsaKeysService = rsaKeysService;
  }

  async ngOnInit() {
    await this.fillContactList();
    // submint searsh input when pressing enter
    $(document).ready(function () {
      $('input').keydown(function (e: { keyCode: number; }) {
        if (e.keyCode === 13) {
          $('.searchLoginInfo').click();
        }
      });
    });
  }

  async fillContactList() {
    this.contactList = await this.db.Contacts.toArray();
  }

  async ChangeDisplayedMessages(newDesplayedUserLogin: Contact) {
    if (this.isSearchMode) {
      this.isSearchMode = false;
      this.AddNewUserToLocalDb(newDesplayedUserLogin);
      await this.fillContactList();
    }
    this.DataService.currentDisplayedLogin.next(newDesplayedUserLogin.Login);
  }

  async searchUsers() {
    if (this.searchUserLogin.login == "") {
      return
    }
    this.isSearchMode = true;
    // Получаем пользователей по запросу
    let newDispayedUsers: Contact[] = [];
    let result = await this.userService.FindUsers(this.searchUserLogin); // TODO take preloader
    result.forEach(element => {
      var newContact: Contact = { Login: element.login, ContactId: element.id };
      newDispayedUsers.push(newContact);
    });
    // Получаем пользователей находящихся в базе
    var currentUsers = await this.db.Contacts.toArray();
    // Удаляем в списке пользователей, которые уже есть в контах
    currentUsers.forEach(element => {
      newDispayedUsers.forEach(element1 => {
        if (element.Login == element1.Login) {
          newDispayedUsers.splice(newDispayedUsers.indexOf(element1), 1);
        }
      });
    });

    $(".users").hide(500);
    setTimeout(() => {
      this.contactList = newDispayedUsers;
      $(".searchUsersDisplay").show(500);
    }, 500);
  }

  async AddNewUserToLocalDb(newUser: Contact) {
    let insertedUser: Contact = newUser;

    // gen KeyPair
    var rsaKeys = await this.rsaService.GenerateKeyPair();

    var publicKeyId = uuidv4();
    var privateKeyId = uuidv4();

    insertedUser.PrivateKeyId = privateKeyId;
    insertedUser.PublicKeyId = publicKeyId;

    this.ContactService.AddNewContact(insertedUser);

    this.rsaKeysService.AddPrivateKeyToLocalDB(rsaKeys.privateKey, privateKeyId);
    this.rsaKeysService.AddPublicKeyToLocalDB(rsaKeys.publicKey, false, publicKeyId)

    this.backToContactListButton();
    await this.rsaKeysService.SendRSAPublicKey((await this.db.User.toArray().then(x => { return x[0] })).id,
      insertedUser.ContactId, rsaKeys.publicKey);
  }

  async backToContactListButton() {
    this.isSearchMode = false;
    $(".searchUsersDisplay").hide(500);
    await this.fillContactList();
    this.searchUserLogin.login = "";
  }
}