import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './Services/account.service';
import { PresenceService } from './Services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'TeenApp';
  users: any;

  constructor(private http: HttpClient, private accountSeervice: AccountService, private presence: PresenceService){

  }

  ngOnInit(): void {
     
      this.setCurrentUser();
  }

  setCurrentUser(){
    const userFromLS : any = localStorage.getItem('user');
    const user = JSON.parse(userFromLS);
    if(user){
      this.accountSeervice.setCurrentUser(user);
      this.presence.startConnection(user);
    }
  }

  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe(res => {
      this.users = res;
    }, err => {
      console.log(err);
    },
    () => {
      console.log('Users Loaded');
    }
    );
   }
}
