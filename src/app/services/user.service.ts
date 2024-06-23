import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Address } from '../models/address';
import { Observable, catchError, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  arrUser: User[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {
    this, (this.arrUser = []);
  }

  getUsers(): Observable<User[]> {
    //return this.arrUsers
    return this.httpClient
      .get<User[]>(this.baseUrl + '/users')
      .pipe(catchError(this.httpError));
  }

  getUserById(id: number): User {
    for (let i = 0; i < this.arrUser.length; i++) {
      if (id == parseInt(this.arrUser[i].id)) {
        return this.arrUser[i];
      }
    }

    return new User(
      '0',
      '',
      '',
      '',
      1212,
      '',
      '',
      '',
      new Address('', '', '', '', '', '')
    );
  }

  // addUser(user: User): Observable<User[]> {
  //   this.arrUser.push(user);
  //   console.log(this.arrUser);
  //   return of(this.arrUser);
  // }
  addUser(u: User): Observable<User> {
    return this.httpClient
      .post<User>(this.baseUrl + '/users', JSON.stringify(u), this.httpHeader)
      .pipe(catchError(this.httpError));
  }
  updateUser(u: User): Observable<User[]> {
    return this.httpClient
      .put<User[]>(
        this.baseUrl + '/users/' + u.id,
        JSON.stringify(u),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }

  private httpError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
