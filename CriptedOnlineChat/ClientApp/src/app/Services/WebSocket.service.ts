import { Inject, Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { RSAService } from './rsa.service'
import { AppDB, Contact, PrivateKey, PublicKey } from 'src/db';
import { MessageService, SendMessageDTO } from './message.service';
import { SendRSAPublicKeyDTO } from './rsa.keys.service';
import * as forge from 'node-forge';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private HubConnection: HubConnection;
    public baseUrl: string;
    private appDB: AppDB;
    private messageService: MessageService;
    private RSAService: RSAService;
    constructor(@Inject('BASE_URL') baseUrl: string, appDB: AppDB, messageService: MessageService, RSAService: RSAService) {
        this.baseUrl = baseUrl + "schatHub";
        this.messageService = messageService;
        this.appDB = appDB;
        this.RSAService = RSAService;
        this.HubConnection = new HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Debug)
            .withUrl("http://localhost:5172/schatHub")
            .build();
        this.HubConnection.start();
        this.initWebSocket();
    }


    async initWebSocket() {
        await this.HubConnection.on("Test", message => { console.log(message) })
        await this.HubConnection.on("AddNewRSAKeys", rsaKeys => { this.AddNewRSAKeysServer(<SendRSAPublicKeyDTO[]>rsaKeys) })
        await this.HubConnection.on("AddNewMessages", messages => {this.messageService.AddNewMessages(messages)})
    }

    async sendMessage(message: SendMessageDTO) {
        await this.HubConnection.send("SendMessage", message);
    }

    async SendPublicRSAKey(rsaKey: SendRSAPublicKeyDTO) {
        await this.HubConnection.send("SendRSAKeys", rsaKey);
    }



    
    public async AddPublicKeyToLocalDB(key: forge.pki.rsa.PublicKey, isRecipientKey: boolean, idKey: string) {
        let pubKey: PublicKey = { id: idKey, n: key.n, e: key.e };
        if (isRecipientKey) {
            this.appDB.PublicKeyForEncript.add(pubKey);
        }
        else {
            this.appDB.PublicKey.add(pubKey);
        }
    }

    public async AddPrivateKeyToLocalDB(privateKey: forge.pki.rsa.PrivateKey, idKey: string) {
        let prKey: PrivateKey = {
            id: idKey, n: privateKey.n, e: privateKey.e,
            d: privateKey.d, p: privateKey.p, q: privateKey.q,
            dP: privateKey.dP, dQ: privateKey.dQ, qInv: privateKey.qInv
        };

        await this.appDB.PrivateKey.add(prKey);
    }

    public async SendRSAPublicKey(senderid: string, recipientId: string, pubKey: forge.pki.rsa.PublicKey) {
        let sendedRsa: SendRSAPublicKeyDTO = {
            senderUserId: senderid,
            recipientUserId: recipientId, nDataJson: JSON.stringify(pubKey.n.data),
            ns: pubKey.n.s, nt: pubKey.n.t, eDataJson: JSON.stringify(pubKey.e.data), es: pubKey.e.s, et: pubKey.e.t
        };

        await this.SendPublicRSAKey(sendedRsa);
    }

    public async AddNewRSAKeysServer(keys: SendRSAPublicKeyDTO[]) {
        keys.forEach(async element => {
            // parsing data
            let insertedPubKey: PublicKey = { id: uuidv4() };
            // parse n data
            let n: forge.jsbn.BigInteger = new forge.jsbn.BigInteger(null);
            n.s = element.ns;
            n.t = element.nt;
            n.data = JSON.parse(element.nDataJson);
            // parse e data
            let e: forge.jsbn.BigInteger = new forge.jsbn.BigInteger(null);
            e.s = element.es;
            e.t = element.et;
            e.data = JSON.parse(element.eDataJson);
            insertedPubKey.e = e;
            insertedPubKey.n = n;
            // add to db
            this.appDB.PublicKeyForEncript.add(insertedPubKey);
            let isContaints: boolean = await this.appDB.Contacts.filter(x => x.ContactId == element.senderUserId).count() == 0;
            if (isContaints) {
                var keyPair = await this.RSAService.GenerateKeyPair();
                let pubKeyId: string = uuidv4();
                let prtKeyId: string = uuidv4();
                await this.AddPublicKeyToLocalDB(keyPair.publicKey, false, pubKeyId);
                await this.AddPrivateKeyToLocalDB(keyPair.privateKey, prtKeyId);
                await this.SendRSAPublicKey(element.recipientUserId, element.senderUserId, keyPair.publicKey);
                let newContact: Contact = { Login: element.senderLogin };
                newContact.ContactId = element.senderUserId;
                newContact.Login = element.senderLogin;
                newContact.PublicKeyForEncriptId = insertedPubKey.id;
                newContact.PrivateKeyId = prtKeyId;
                newContact.PublicKeyId = pubKeyId;
                this.appDB.Contacts.add(newContact);
            }
            else
            {
                var contact = await this.appDB.Contacts.filter(x => x.ContactId == element.senderUserId).first();
                await this.appDB.Contacts.update(contact, { "PublicKeyForEncriptId" : insertedPubKey.id})
            }

        });
    }
}