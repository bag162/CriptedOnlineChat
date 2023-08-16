import { Inject, Injectable } from '@angular/core';
import * as forge from 'node-forge';
@Injectable({
    providedIn: 'root',
})

export class RSAService {
    constructor() {
    }

    public GenerateKeyPairs(): KeyPairs {
        let keysPair = forge.pki.rsa.generateKeyPair({bits: 2048, e: 0x10001});
        let keys = new KeyPairs(keysPair.publicKey.e.toString(), keysPair.privateKey.e.toString());
        return keys;
    }
}

class KeyPairs {
    constructor(publicKey: string, privateKey: string) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    publicKey: string;
    privateKey: string;
}