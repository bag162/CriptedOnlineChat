import { Component, Input } from '@angular/core';
import { timer } from 'rxjs';
import { AppDB, Contact, Message, PrivateKey, PublicKey, User } from 'src/db';
import { DataService } from '../../Services/data.service';
import { WebSocketService } from '../../Services/websocket.service';
import { SendMessageDTO } from 'src/app/Services/message.service';
import { RSAService } from 'src/app/Services/rsa.service';
import * as forge from 'node-forge';
declare var $: any;

@Component({
  selector: 'message-list-component',
  templateUrl: './message.list.component.html',
  styleUrls: ['./message.list.component.css']
})
export class MessageListComponent {
  @Input() public displayedUserLogin?: string;
  // services
  private DataService: DataService;
  private WebSocketService: WebSocketService;
  private db: AppDB;
  private rsaService: RSAService;

  // variables to display
  public messageList: Message[] = [];
  public user: User = { Login: "" };
  public isKeyExchangeCompleted: boolean = false;

  // variables to html
  public sendedMessage: string = "";
  public dispayedMessagesLogin: string = "";

  constructor(db: AppDB, dataService: DataService, webSocketService: WebSocketService, rsaService: RSAService) {
    this.DataService = dataService;
    this.db = db;
    this.WebSocketService = webSocketService;
    this.rsaService = rsaService;
  }

  ngDoCheck() {
    if (this.isKeyExchangeCompleted) {
      $(".messageClass").hide();
    }
    else {
      $(".messageClass").show();
    }
  }

  async ngOnInit() {
    await this.DataService.currentDisplayedLogin.subscribe((currentDisplayedLogin: string) => {
      this.DisplayMissages(currentDisplayedLogin)
      this.dispayedMessagesLogin = currentDisplayedLogin;
      $('.recipientName').text(currentDisplayedLogin);
    });
    await this.db.User.toArray().then(x => this.user = x[0]);

    $(".NoKeyMessage").hide();
    $(".MessageClass").hide();
  }

  public async DisplayMissages(dispayedMessagesLogin: string) {
    // Проверяем, есть ли у отображаемого контакта ключ для шифровки сообщения, если нет, то скрываем компонент отправки сообщения, и отображаем контейнер информирования
    var displayedContact: Contact = await this.db.Contacts.filter(x => x.Login == dispayedMessagesLogin).first();
    if (displayedContact.PublicKeyForEncriptId == undefined) {
      $(".NoKeyMessage").show();
      $(".MessageClass").hide();
    }
    else {
      $(".NoKeyMessage").hide();
      $(".MessageClass").show();
    }

    // выгрузка сообщений из localdb и отображение их
    this.messageList = [];
    var messagesToDisplay: Message[] = await this.db.Messages.filter(x => x.RecipientLogin == dispayedMessagesLogin).toArray();
    messagesToDisplay.forEach(async element => {
      let decriptedNewMessage: Message = { Data: element.Data, IsSender: element.IsSender, RecipientLogin: element.RecipientLogin }
      this.messageList.push(decriptedNewMessage)
    });
    // скол до новых сообщений
    setTimeout(() => {
      var block = document.getElementById("scrollChat");
      block.scrollTop = 9999;
    }, 0);

  }

  public async SendMessage() {
    if (this.sendedMessage == "") {
      return;
    }
    let contactForSend: Contact = await this.db.Contacts.filter(x => x.Login == this.dispayedMessagesLogin).first();
    let key: PublicKey = await this.db.PublicKeyForEncript.filter(x => x.id == contactForSend.PublicKeyForEncriptId).first();
    var keyForEncript = forge.pki.rsa.setPublicKey(key.n, key.e);
    let encriptedMessage: string = await this.rsaService.EncriptMessage(this.sendedMessage, keyForEncript);
    let message: SendMessageDTO = {
      data: encriptedMessage, senderId: this.user.id,
      recipientId: contactForSend.ContactId
    };

    await this.WebSocketService.sendMessage(message);
    let addedMessage: Message = { Data: this.sendedMessage, RecipientLogin: contactForSend.Login, IsSender: true };
    await this.db.Messages.add(addedMessage);
    this.messageList = [];
    this.sendedMessage = "";
    await this.DisplayMissages(contactForSend.Login);
  }
}