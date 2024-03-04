import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Product } from '../_models/product';
import { Observable } from 'rxjs';

const baseUrl = `${environment.apiUrl}/bp/products`;

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<Product[]>(baseUrl);
  }

  createProduct(params: any): Observable<any> {
    return this.http.post(baseUrl, params);
  }

  updateProduct(params: any): Observable<any> {
    return this.http.put(baseUrl, params);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}?id=${id}`);
  }

  verifyProductExistence(id: string): Observable<any> {
    return this.http.get(`${baseUrl}/verification?id=${id}`);
  }
}
