import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }


  send_email(email: String, location: String): Observable<String> {

    var user = {
      "email": email,
      "location":location
    }

    var emailUrl = "http://localhost:3000/api/sendEmail"

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<String>(emailUrl, user, httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      return Observable.throw("Unable to connect to Server, please try again");
    }
    else {
      // The backend returned an unsuccessful response code.
      return throwError(error.error || "Server Error");
    }
  }
}
