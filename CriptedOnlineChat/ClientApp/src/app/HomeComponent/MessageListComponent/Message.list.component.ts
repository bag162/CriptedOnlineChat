import { Component, Input } from '@angular/core';
import { timer } from 'rxjs';
import { AppDB, Message, User } from 'src/db';
import { DataService } from '../../Services/DataService';
import { WebSocketService } from '../../Services/WebSocket.service';
declare var $: any;

@Component({
  selector: 'message-list-component',
  templateUrl: './message.list.component.html',
  styleUrls: ['./message.list.component.css']
})
export class MessageListComponent {
  @Input() public displayedUserLogin?: string;
  private DataService: DataService;
  private WebSocketService: WebSocketService;
  public messageList: Message[] = [];
  public user: User = { Login: "" };
  private db: AppDB;
  public sendedMessage: string = "";
  public dispayedMessagesLogin: string = "";

  constructor(db: AppDB, dataService: DataService, webSocketService: WebSocketService) {
    this.DataService = dataService;
    this.db = db;
    this.WebSocketService = webSocketService;
  }

  ngDoCheck() {
    if (this.messageList.length == 0) {
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
    });
    await this.db.User.toArray().then(x => this.user = x[0]);
  }

  public async DisplayMissages(dispayedMessagesLogin: string) {
    await this.db.Messages.where("RecipientLogin").equalsIgnoreCase(dispayedMessagesLogin).toArray().then(x => this.messageList = x);
  }

  public async SendMessage() {
    if (this.sendedMessage == "") {
      return;
    }

    this.WebSocketService.sendMessage(this.sendedMessage, this.dispayedMessagesLogin);
  }
}