import { Inject, Injectable } from '@angular/core';
import { worker } from 'cluster';
import * as forge from 'node-forge';
import { PrivateKey, PublicKey } from 'src/db';
import { WebSocketService } from './websocket.service';


@Injectable({ providedIn: 'root' })
export class RSAService {
    private keyPair: forge.pki.rsa.KeyPair;

    constructor() {
        this.keyPair = forge.pki.rsa.generateKeyPair();
    }
    public async GenerateKeyPair(): Promise<forge.pki.rsa.KeyPair> {
        let keyPair = await forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001, workers: 2 });
        return keyPair;
    }

    public async EncriptMessage(message: string, publicKey: forge.pki.rsa.PublicKey): Promise<string> {
        var validKeyPair = forge.pki.rsa.generateKeyPair();
        var newPubKey = validKeyPair.publicKey;
        newPubKey.e.data = publicKey.e.data;
        newPubKey.e.s = publicKey.e.s;
        newPubKey.e.t = publicKey.e.t;
        newPubKey.n.data = publicKey.n.data;
        newPubKey.n.s = publicKey.n.s;
        newPubKey.n.t = publicKey.n.t;

        return await newPubKey.encrypt(forge.util.encodeUtf8(message));;
    }

    public async DecriptMessage(message: string, privateKey: PrivateKey): Promise<string> {
        var newPrKey = this.keyPair.privateKey;
        newPrKey.d.data = privateKey.d.data;
        newPrKey.d.s = privateKey.d.s;
        newPrKey.d.t = privateKey.d.t;

        newPrKey.dP.data = privateKey.dP.data;
        newPrKey.dP.s = privateKey.dP.s;
        newPrKey.dP.t = privateKey.dP.t;

        newPrKey.dQ.data = privateKey.dQ.data;
        newPrKey.dQ.s = privateKey.dQ.s;
        newPrKey.dQ.t = privateKey.dQ.t;

        newPrKey.e.data = privateKey.e.data;
        newPrKey.e.s = privateKey.e.s;
        newPrKey.e.t = privateKey.e.t;

        newPrKey.n.data = privateKey.n.data;
        newPrKey.n.s = privateKey.n.s;
        newPrKey.n.t = privateKey.n.t;

        newPrKey.p.data = privateKey.p.data;
        newPrKey.p.s = privateKey.p.s;
        newPrKey.p.t = privateKey.p.t;

        newPrKey.q.data = privateKey.q.data;
        newPrKey.q.s = privateKey.q.s;
        newPrKey.q.t = privateKey.q.t;

        newPrKey.qInv.data = privateKey.qInv.data;
        newPrKey.qInv.s = privateKey.qInv.s;
        newPrKey.qInv.t = privateKey.qInv.t;

        return forge.util.decodeUtf8(await newPrKey.decrypt(message));
    }


}