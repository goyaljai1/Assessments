import { Injectable } from '@angular/core';
import { Itinery, Product } from '../models/add-assessment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  arrProducts: Product[] = [];
  baseUrl: string = 'http://localhost:3000';
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {
    this, (this.arrProducts = []);
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(`${this.baseUrl}/assessment`)
      .pipe(catchError(this.httpError));
  }
  addProduct(p: Product): Observable<Product> {
    return this.httpClient
      .post<Product>(
        this.baseUrl + '/assessment',
        JSON.stringify(p),
        this.httpHeader
      )
      .pipe(catchError(this.httpError));
  }
  getProductById(id: string): Product {
    for (let i = 0; i < this.arrProducts.length; i++) {
      if (id == this.arrProducts[i].id) {
        return this.arrProducts[i];
      }
    }

    return new Product('', '', '', '', 0, 0, 0, '', []);
  }

  updateProduct(p: Product): Observable<Product[]> {
    return this.httpClient
      .put<Product[]>(
        this.baseUrl + '/users/' + p.id,
        JSON.stringify(p),
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
