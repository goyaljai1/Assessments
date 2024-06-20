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
    this,
      (this.arrUser = [
        // new User(
        //   0,
        //   'John',
        //   'Hugh',
        //   'john@example.com',
        //   1234567890,
        //   '1990-01-01',
        //   'admin',
        //   'password123',
        //   new Address('123', 'Main Street', 'Downtown', 'CA', 'USA', '9001')
        // ),
        // new User(
        //   1,
        //   'Jack',
        //   'Hugh',
        //   'jack@example.com',
        //   1234567890,
        //   '1990-01-01',
        //   'user',
        //   'password1234',
        //   new Address('123', 'Main Street', 'Downtown', 'CA', 'USA', '9001')
        // ),
      ]);
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

  httpError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code:${error.status}\nMessafe:${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
