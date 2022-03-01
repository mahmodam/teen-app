import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { User } from '../models/User';
import { AccountService } from '../Services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  member!:Member;
  model: any = {};
  currentUser$: Observable<User | null>;

  constructor(private accountService: AccountService,
    private router : Router,
    private toastr: ToastrService) {
    this.currentUser$ = accountService.currentUser$;
   }

  ngOnInit(): void {
    
  }

  

  logout(){
    this.router.navigateByUrl('/')
    this.accountService.logout();
  }

  login(){
    this.accountService.login(this.model)
    .subscribe(response => {
      this.router.navigateByUrl('/members');
      console.log(response);
      this.toastr.success('Hello');
     });
  }

  

}
