import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/User';
import { UserParams } from 'src/app/models/user-params';
import { AccountService } from 'src/app/Services/account.service';
import { MemberService } from 'src/app/Services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members: Member[];
  member: Member;
  pagination: Pagination;
  userParams: UserParams;
  user: User;

  genderList = [{value: 'male', display:'Males'}, {value:"female", display:'Females'}];

  constructor(private memberService:MemberService, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe((user: any) => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
   }

  ngOnInit(): void {
   this.loadMembers();
  }


  loadMembers(){
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
      this.userParams.pageNumber = 1;
    });
  }

  pageChanged({page}: any){
    this.userParams.pageNumber = page;
    this.loadMembers();
  }

  resetFilters(){
    this.userParams= new UserParams(this.user);
    this.loadMembers();
  }
  
 
  

  
}
