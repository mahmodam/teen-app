import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members: Member[] = [];

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getMembers():Observable<Member[]>{
    if(this.members.length){
      return of(this.members);
    }
    return this.http.get<Member[]>(`${this.baseUrl}users`).pipe(
      tap(members => this.members = members)
    )
  }

  getMember(username : string) : Observable<Member>{
    const member = this.members.find(m => m.username === username);
    if(member){
      return of(member);
    }
    return this.http.get<Member>(`${this.baseUrl}users/${username}`)
  }

  updateMember(member : Member){
    return this.http.put(`${this.baseUrl}users`, member).pipe(
      tap(() => {
        const index = this.members.findIndex(m => m.username === member.username);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number){
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(`${this.baseUrl}users/delete-photo/${photoId}`);
  }

}
