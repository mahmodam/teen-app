import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { userInfo } from 'os';
import { User } from '../models/User';
import { AccountService } from '../Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  loggedIn: boolean = false;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  

  logout(){
    this.loggedIn = false;
    this.accountService.logout();
  }

  login(){
    this.accountService.login(this.model)
    .subscribe(response => {
      console.log(response);
      this.loggedIn = true;
    }, error => {
      console.log('Failed to login', error);
    });
  }

  getCurrentUser(){
    this.accountService.currentUser$.subscribe((user:User | null) => {
      this.loggedIn = !!user;
    });
  }

}
