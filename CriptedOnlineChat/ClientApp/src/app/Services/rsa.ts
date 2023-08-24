import { Inject, Injectable } from '@angular/core';
import { worker } from 'cluster';
import * as forge from 'node-forge';


@Injectable({ providedIn: 'root' })
export class RSAService {
    constructor() {
    }
    public async GenerateKeyPair(): Promise<forge.pki.rsa.KeyPair> {
        let keyPair = await forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001, workers: 2 });
        return keyPair;
    }

    public async EncriptMessage(message: string, publicKey: forge.pki.rsa.PublicKey): Promise<string> {
        return await publicKey.encrypt(forge.util.encodeUtf8(message));;
    }

    public async DecriptMessage(message: string, privateKey: forge.pki.rsa.PrivateKey): Promise<string> {
        return forge.util.decodeUtf8(await privateKey.decrypt(message));
    }

}