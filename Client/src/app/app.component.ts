import { HttpClient } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './Services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'Client';
  users: any;

  constructor(private http: HttpClient, private accountSeervice: AccountService){

  }

  ngOnInit(): void {
     
      this.setCurrentUser();
  }

  setCurrentUser(){
    const userFromLS : any = localStorage.getItem('user');
    const user = JSON.parse(userFromLS);
    this.accountSeervice.setCurrentUser(user);
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
