import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AccountService } from '../Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  // loggedIn: boolean = false;
  currentUser$: Observable<User | null>;
  constructor(private accountService: AccountService,
    private router : Router,
    private toastr: ToastrService) {
    this.currentUser$ = accountService.currentUser$;
   }

  ngOnInit(): void {
    // this.getCurrentUser();
  }

  

  logout(){
    // this.loggedIn = false;
    this.router.navigateByUrl('/')
    this.accountService.logout();
  }

  login(){
    this.accountService.login(this.model)
    .subscribe(response => {
      this.router.navigateByUrl('/members');
      console.log(response);
      // this.loggedIn = true;
    }, error => {
      this.toastr.error(error.error)
      console.log('Failed to login', error);
    });
  }

  // getCurrentUser(){
  //   this.accountService.currentUser$.subscribe((user:User | null) => {
  //     this.loggedIn = !!user;
  //   });
  // }

}
