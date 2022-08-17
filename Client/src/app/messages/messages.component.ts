import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { MessagesService } from '../Services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;

  loading: boolean = false;
  
  constructor(private messagesService: MessagesService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;

    this.messagesService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(message => {
      this.messages = message.result;
      this.pagination = message.pagination;

      this.loading = false;
    });
  }

  deleteMessage(id: number) {
    this.messagesService.deleteMessage(id).subscribe(() => {
      this.messages = this.messages.filter(message => message.id !== id);
    });
  }


  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }

}
