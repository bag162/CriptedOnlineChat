import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import * as forge from 'node-forge';

@Injectable({ providedIn: 'root' })
export class AppDB extends Dexie {
    User!: Table<User, number>;
    Messages!: Table<Message, number>;
    Contacts!: Table<Contact, number>;
    PrivateKey!: Table<PrivateKey, number>;
    PublicKey!: Table<PublicKey, number>;
    PublicKeyForEncript!: Table<PublicKey, number>;
    constructor() {
        super('criptedOnlineChatDB');
        this.version(3).stores({
            User: '++id, Login',
            Messages: '++id, Data, RecipientLogin, IsSender',
            Contacts: 'ContactId, Login, PrivateKeyId, PublicKeyId, PublicKeyForEncriptId',
            PrivateKey: 'id, n, e, d, p, q, dP, dQ, qInv',
            PublicKey: 'id, n, e',
            PublicKeyForEncript: 'id, n, e'
        });
    }
}

export const db = new AppDB();

export interface User {
    id?: string;
    Login: string;
}

export interface Message {
    id?: number;
    Data: string;
    RecipientLogin: string;
    IsSender: boolean;
}

export interface Contact {
    ContactId?: string;
    Login: string;
    PrivateKeyId?: string;
    PublicKeyId?: string;
    PublicKeyForEncriptId?: string;
}

export interface PrivateKey {
    id: string;
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
    id?: string;
    n?: forge.jsbn.BigInteger;
    e?: forge.jsbn.BigInteger;
}