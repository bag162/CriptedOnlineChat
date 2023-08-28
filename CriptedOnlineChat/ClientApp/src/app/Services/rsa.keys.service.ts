import { Injectable } from '@angular/core';
import { AppDB, Contact, PrivateKey, PublicKey } from 'src/db';
import * as forge from 'node-forge';
import { WebSocketService } from './websocket.service';
import { RSAService } from './rsa.service';

@Injectable({ providedIn: 'root' })
export class RSAKeysService {
    private appDB: AppDB;
    private WebSocketService: WebSocketService;
    private rsaService: RSAService;

    constructor(AppDB: AppDB, WebSocketService: WebSocketService, rsaService: RSAService) {
        this.rsaService = rsaService;
        this.appDB = AppDB;
        this.WebSocketService = WebSocketService;
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

        await this.WebSocketService.SendPublicRSAKey(sendedRsa);
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
                var keyPair = await this.rsaService.GenerateKeyPair();
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

        });
    }
}


@Injectable({ providedIn: 'root' })
export class SendRSAPublicKeyDTO {
    public senderLogin?: string = "";
    public senderUserId: string = "";
    public recipientUserId: string = "";
    public nt: number = 0;
    public ns: number = 0;
    public et: number = 0;
    public es: number = 0;
    public nDataJson: string = "";
    public eDataJson: string = "";
}
function uuidv4(): string {
    throw new Error('Function not implemented.');
}

