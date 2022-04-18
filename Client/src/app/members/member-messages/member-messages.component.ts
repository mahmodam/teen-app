import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { MessagesService } from 'src/app/Services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() username: string;
  @Input() messages : Message[];
  messageContent: string;

  constructor(private messagesService: MessagesService) { }

  ngOnInit(): void {
    //this.loadMessages();
  }

  // loadMessages(){
  //   this.messagesService.getMessageThread(this.username).subscribe(messages => {
  //     this.messages = messages;
  //   });
  // }

  sendMessage(form: NgForm){
    this.messagesService.sendMessage(this.username, this.messageContent).subscribe((message) => {
      this.messages.push(message as Message);
      form.reset();
    })
  }

}
