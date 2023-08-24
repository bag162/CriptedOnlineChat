import { Inject, Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { connected } from 'process';
import { setTimeout } from 'timers';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private HubConnection: HubConnection;
    public baseUrl: string;
    constructor(@Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl + "schatHub";
        this.HubConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5172/schatHub")
        .build();
        this.HubConnection.start();
        this.initWebSocket();
    }


    async initWebSocket()
    {
        await this.HubConnection.on("Test", message => { console.log(message) })
    }

    async sendMessage(message: string, recipientLogin: string)
    {
        await this.HubConnection.send("SendMessage", message, recipientLogin);
    }
}