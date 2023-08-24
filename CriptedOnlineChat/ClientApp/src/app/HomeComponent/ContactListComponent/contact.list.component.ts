import { Component } from '@angular/core';
import { AppDB, Contact } from 'src/db';
import { DataService } from '../../Services/DataService';

@Component({
  selector: 'contact-list-component',
  templateUrl: './contact.list.component.html',
  styleUrls: ['./contact.list.component.css']
})
export class ContactListComponent {
  public DataService: DataService;
  public contactList: Contact[] = [];
  private db: AppDB;
  constructor(db: AppDB, DataService: DataService)
  {
    this.db = db;
    this.DataService = DataService;
  }

  async ngOnInit()
  {
    this.contactList = await this.db.Contacts.toArray();
  }

  ChangeDisplayedMessages(newDesplayedUserLogin: string)
  {
    this.DataService.currentDisplayedLogin.next(newDesplayedUserLogin);
  }
}
