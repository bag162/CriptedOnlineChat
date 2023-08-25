import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import * as forge from 'node-forge';

var privateKey: PrivateKey;
var publicKey: PublicKey;

@Injectable({ providedIn: 'root' })
export class AppDB extends Dexie {
    User!: Table<User, number>;
    Messages!: Table<Message, number>;
    Contacts!: Table<Contact, number>
    constructor() {
        super('criptedOnlineChatDB');
        this.version(3).stores({
            User: '++id, Login',
            Messages: '++id, Data, DateTime, RecipientLogin, IsSender',
            Contacts: '++id, Login, PrivateKey, PublicKey'
        });
        this.on('populate', () => this.populate());
    }

    async populate() {
        await db.Contacts.bulkAdd([
            {
                Login: "Bagike",
                PrivateKey: privateKey,
                PublicKey: publicKey
            },
            {
                Login: "North",
                PrivateKey: privateKey,
                PublicKey: publicKey
            },
            {
                Login: "West",
                PrivateKey: privateKey,
                PublicKey: publicKey
            },
            {
                Login: "LosAngeles",
                PrivateKey: privateKey,
                PublicKey: publicKey
            }
        ]);

        await db.Messages.bulkAdd([
            {
                Data: "Привет, это бажик",
                DateTime: "18:11",
                RecipientLogin: "Bagike",
                IsSender: true
            },
            {
                Data: "Отправляю тебе тестовое сообщение",
                DateTime: "18:12",
                RecipientLogin: "Bagike",
                IsSender: true
            },
            {
                Data: "Привет, я получил твое тестовое сообщение",
                DateTime: "18:13",
                RecipientLogin: "Bagike",
                IsSender: false
            },
            {
                Data: "",
                DateTime: "",
                RecipientLogin: "North",
                IsSender: true
            },
            {
                Data: "",
                DateTime: "",
                RecipientLogin: "North",
                IsSender: true
            }
        ]);
        await db.User.bulkAdd([
            {
                Login: "testLogin"
            }
        ]);
    }

}

export const db = new AppDB();

export interface User {
    id?: number;
    Login: string;
}

export interface Message {
    id?: number;
    Data: string;
    DateTime: string;
    RecipientLogin: string;
    IsSender: boolean;
}

export interface Contact {
    id?: number;
    Login: string;
    PrivateKey?: PrivateKey;
    PublicKey?: PublicKey;
}

export interface PrivateKey {
    RecipientLogin: string;
    n: forge.jsbn.BigInteger;
    e: forge.jsbn.BigInteger;
    d: forge.jsbn.BigInteger;
    p: forge.jsbn.BigInteger;
    q: forge.jsbn.BigInteger;
    dP: forge.jsbn.BigInteger;
    dQ: forge.jsbn.BigInteger;
    qInv: forge.jsbn.BigInteger;
}

export interface PublicKey {
    RecipientLogin: string;
    n: forge.jsbn.BigInteger;
    e: forge.jsbn.BigInteger;
}