import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;

  private onlineUsersSource$ = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource$.asObservable();

  constructor(private toastr: ToastrService) { }

  public startConnection(user: User): void {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence', { 
      accessTokenFactory: () => {
        return user.token;
      }
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start()
    .catch(err => console.log(err));

    this.hubConnection.on('UserIsOnline', (username) => {
      this.toastr.success(username + ' is online');
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.toastr.info(username + ' is offline');
    });

    this. hubConnection.on('GetOnlineUsers', (username: string[]) => {
      this.onlineUsersSource$.next(username);
    })
    
  }

  public stopConnection(): void {
    this.hubConnection.stop()
    .catch(err => console.log(err));
  }
}
