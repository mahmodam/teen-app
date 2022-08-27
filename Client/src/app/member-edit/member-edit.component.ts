import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from '../models/member';
import { User } from '../models/User';
import { AccountService } from '../Services/account.service';
import { MemberService } from '../Services/member.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  member! : Member;
  user: User;
  @ViewChild('editForm') editForm: NgForm;
  // @ViewChild('deleteForm') deleteForm: NgForm;
  
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private memberService: MemberService,private toastr: ToastrService, private router: Router) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user as User);
  }

  ngOnInit(): void {
    this.loadMember();
  }

loadMember(){
  this.memberService.getMember(this.user.username).subscribe(member => {
    this.member = member;
  });
}

updateMember(){
  this.memberService.updateMember(this.member).subscribe(() => {
  this.toastr.success('profile updated success');
  this.editForm.reset(this.member);
})
}

deleteMember(){
  Swal.fire({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to use this account!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'blueviolet',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      this.memberService.deleteMember(this.user.username).subscribe(() => {
        this.toastr.success('profile deleted success');
        this.accountService.logout();
        this.router.navigateByUrl('/');
  
      }
      );
    }
  }
  );
}


}

  


