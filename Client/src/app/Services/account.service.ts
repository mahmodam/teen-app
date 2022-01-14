import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { User } from '../models/User';

// אפשר לבצע לו inject
// שאפשר לגשת אליו מכל מקום ב root
@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = 'https://localhost:5001/api/';
  constructor(private http: HttpClient) { }

  private currentUserSource$ = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource$.asObservable();

  login(model:any){
    return this.http.post<User>(this.baseUrl + 'account/login', model)
    .pipe(
      map((response: User) => {
        const user = response;
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource$.next(user);
        }
      })
    );
  }

  // פונקצית helper
  //לשימוש רק אם יש צורך
  setCurrentUser(user: User){
    this.currentUserSource$.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource$.next(null);
  }

  register(model : any){
    // מקבלים משתמש מהשרת
    return this.http.post<User>(this.baseUrl + 'account/register', model)
    // מה שעושים עם המשתמש שהגיע מהשרת
    .pipe(
      map((user:User) =>{
      if(user){
        // מכניסים אותו ל localStorage
        localStorage.setItem('user', JSON.stringify(user));
        // מכנסים אותו ל currentUser
        this.currentUserSource$.next(user);
      }
      return user;
    })
    )
  }

}
