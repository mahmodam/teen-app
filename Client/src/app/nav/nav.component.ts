import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { from, Observable } from 'rxjs';
import { Member } from '../models/member';
import { User } from '../models/User';
import { AccountService } from '../Services/account.service';
import { MemberService } from '../Services/member.service';
import { MessagesService } from '../Services/messages.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{

  member!:Member;
  model: any = {};
  currentUser$: Observable<User | null>;

  badge = 0;

  public searchUser: string;

  constructor(private accountService: AccountService,
    private router : Router,
    private toastr: ToastrService,
    private memberService: MemberService, 
    private messagesService: MessagesService) {
    this.currentUser$ = accountService.currentUser$;
   }

  ngOnInit(): void {}
  

  logout(){
    this.router.navigateByUrl('/')
    this.accountService.logout();
    this.toastr.info('Goodbye!', 'See you again soon');
  }

  login(){
    this.accountService.login(this.model)
    .subscribe(response => {
      this.router.navigateByUrl('/members');
     // console.log(response);
      this.toastr.success('Hello ' + this.model.username + '!', 'Welcome to Teen-App');
      this.messagesService.getUnreadMessagesCount().subscribe(count => {
        this.badge = count;
      });
     });
  }

  SearchMember(form:NgForm){
    this.memberService.getMember(this.searchUser).subscribe(response => {
     
      if(this.searchUser == null){
        this.toastr.error('Please enter a username');
      }
      
      this.member = response;
      this.router.navigateByUrl('/members/' + this.searchUser.toLowerCase());
      form.reset();
    
    });
  }

  hiddenbadge(){
    this.badge = 0;
  }

}
