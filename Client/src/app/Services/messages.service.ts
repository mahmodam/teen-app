import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { getPaginationParams, getPaginationResult } from './pagination-helper';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationParams(pageNumber, pageSize);
    params = params.append('container', container);

    return getPaginationResult<Message[]>(`${this.baseUrl}messages`, params, this.http);

  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`);
  }

  sendMessage(username: string, content: string){
    const createMessage = {recipientUsername: username, content: content};

    return this.http.post(`${this.baseUrl}messages`, createMessage);
  }

  deleteMessage(id: number){
    return this.http.delete(`${this.baseUrl}messages/${id}`);
  }

  getUnreadMessagesCount(){
    return this.http.get<number>(`${this.baseUrl}messages/count`);
  }

}
