import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PaginationResult } from "../models/pagination";

export function getPaginationResult<T>(url: string, params: HttpParams, http: HttpClient): Observable<PaginationResult<T>> {
    // מעבירים אותו מלמעלה לפה והופכלם אותא ל generic
   const paginatedResult: PaginationResult<T> = new PaginationResult<T>();
 
   return http.get<T>(url,
     {
         // כדי להתיחס ל response ולא ל body שהגיע מהשרת בגלל שיש header שהו page
        // בלי ה response הוא מביא את ה data כאילו הוא יראה רק את ה body
        // ה response מכיל בתוכו את הכל כולל ה body אבל אם לא מצינים אותו האו יחזיר רק את ה body
       observe: 'response',
       // מעבירים לו את ה params
       params
      // pipe => בחזרה מהשרת לפונקציה הבאה
     }).pipe(
       // ה map מסתקל על params
       map((res: HttpResponse<T>) => {
         // הכנסת ה body 
         paginatedResult.result = res.body as T;
            // מחלצים את ה header שהוא מכיל את כל הנתונים של ה page
         // ('Pagination') || '') אם אין את ה header הזה יהיה string ריק
         if (res.headers.get('Pagination') !== null) {
           paginatedResult.pagination = JSON.parse(res.headers.get('Pagination') || '');
         }
         return paginatedResult;
       })
     );
 }
 
 // בשביל נוחות מיצרים אותה שהיא מחזירה את ה headers של ה page
 export function getPaginationParams(pageNumber: number, pageSize: number) {
 
    // לא HttpHeaders כי זה מידע שרוצים לשלוח ב get ב url זה יהי params
   let params = new HttpParams();
   params = params.append('pageNumber', pageNumber.toString());
   params = params.append('pageSize', pageSize.toString());
   return params;
 }