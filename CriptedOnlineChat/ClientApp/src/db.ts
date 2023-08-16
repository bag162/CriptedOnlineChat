import Dexie, { Table } from 'dexie';

export interface User {
    id?: number;
    Login: string;
}

export interface Message {
    id?: number;
    Data: string;
    DateTime: string;
}



export class AppDB extends Dexie {
    User!: Table<User, number>;
    Messages!: Table<Message, number>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(3).stores({
            User: '++id',
            Messages: '++id',
        });
    }
}

export const db = new AppDB();