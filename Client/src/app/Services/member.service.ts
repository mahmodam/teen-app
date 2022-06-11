import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginationResult } from '../models/pagination';
import { UserParams } from '../models/user-params';
import { getPaginationParams, getPaginationResult } from './pagination-helper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  members: Member[] = [];

  baseUrl = environment.apiUrl;
  memberCache = new Map<string, PaginationResult<Member[]>>();

  constructor(private http: HttpClient) { }


  getMembers(userParams: UserParams):Observable<PaginationResult<Member[]>>{

    const cacheKey = Object.values(userParams).join('-');
    const resule = this.memberCache.get(cacheKey);
    if(resule){
      return of(resule);
    }

    let params = getPaginationParams(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    
   
    return getPaginationResult<Member[]>(`${this.baseUrl}users`, params, this.http).pipe(tap(res => {
      this.memberCache.set(cacheKey, res);
    }))
  }

  // private getPaginationResult<T>(url: string, params: HttpParams): Observable<PaginationResult<T>> {
  // const paginationResult :PaginationResult<T> = new PaginationResult<T>();

  //   return this.http.get<T>(url, {
  //     observe: 'response',
  //     params
  //   }).pipe(
  //     map((response: HttpResponse<T>) => {
  //       paginationResult.result = response.body as T;
  //       if (response.headers.get('Pagination') != null) {
  //         paginationResult.pagination = JSON.parse(response.headers.get('Pagination') || '');
  //       }
  //       return paginationResult;
  //     })
  //   );
  // }

  getMember(username : string) : Observable<Member>{

    const members = [... this.memberCache.values()];
    const allMembers = members.reduce((arr: Member[], elem: PaginationResult<Member[]>) => arr.concat(elem.result), []);
    const foundMember = allMembers.find(m => m.username === username);
    if(foundMember){
      return of(foundMember);
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

  // private getPaginationParams({pageNumber, pageSize} : UserParams){
  //   let params = new HttpParams();
  //   if(pageNumber != null && pageSize != null){
  //     params = params.append('pageNumber', pageNumber.toString());
  //     params = params.append('pageSize', pageSize.toString());
  //   }
  //   return params;
  // }

  

}
