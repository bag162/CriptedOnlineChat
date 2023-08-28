import { Injectable } from '@angular/core';
import { AppDB, Contact } from 'src/db';

@Injectable({providedIn: 'root'})
export class ContactService {
    private AppDb: AppDB;

    constructor(AppDb: AppDB) { 
        this.AppDb = AppDb;
    }
    
    public async AddNewContact(newContact: Contact)
    {
        await this.AppDb.Contacts.add(newContact);
    }
}