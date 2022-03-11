import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questionForm: FormGroup;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.questionForm = new FormGroup({
      question: new FormControl('Enter Question Here', Validators.required),
      answer: new FormControl('', Validators.required),
    });
  }

  cancel(){
   
    this.router.navigateByUrl('/members');
  }

  question(){
    console.log(this.questionForm.value);
  }

}
