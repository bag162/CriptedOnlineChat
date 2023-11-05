import { Injectable } from '@angular/core';
import { RSAService } from './rsa.service';
import { WebSocketService } from './websocket.service';
import { AppDB, Message, PrivateKey } from 'src/db';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private rsaService: RSAService;
    private AppDB: AppDB;
    constructor(AppDB: AppDB, rsaService: RSAService) {
        this.AppDB = AppDB;
        this.rsaService = rsaService;
    }


    public async SendMessage(rsaService: RSAService) {
        this.rsaService = rsaService;
    }

    public async AddNewMessages(addedmessages: SendMessageDTO[]) {
        addedmessages.forEach(async element => {
            let recipientLogin: string = (await this.AppDB.Contacts.filter(x => x.ContactId == element.senderId).first()).Login;
            let recipientPrivateKeyId: string = (await this.AppDB.Contacts.filter(x => x.ContactId == element.senderId).first()).PrivateKeyId;
            let privateKeyForDecript: PrivateKey = await this.AppDB.PrivateKey.filter(x => x.id == recipientPrivateKeyId).first();
            let decriptedMessage: string = await this.rsaService.DecriptMessage(element.data, privateKeyForDecript);
            let newMessage: Message = { Data: decriptedMessage, RecipientLogin: recipientLogin, IsSender: false }
            await this.AppDB.Messages.add(newMessage);
        });
    }
}


export class SendMessageDTO {
    public data: string
    public senderId: string
    public recipientId: string
}