import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../Services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any ={};

  // מאפשר להכניס מידע מ HomeComponent
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe(
      (data) => {
        // יצאים החוצה אחרי שמבצעים רישום כי אין טעם אחרי שהרשום הצליח
       this.cancel();
       // אם יש data הוא ידפיס אותו לא חובה
        console.log(data);
        
      },
      error => {
        console.log(error);
        
      }
    )
    
  }

  cancel(){
    this.cancelRegister.emit(false);
    
  }

}
