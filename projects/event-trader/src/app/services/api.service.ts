import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  prefix = '/api/v1/';
  constructor(private http: HttpClient) {}

  private formatUrl(path: string) {
    return `${environment.apiUrl}${this.prefix}${path}`;
  }

  get<T>(url: string, params?: any): Observable<T> {
    return this.http.get<T>(this.formatUrl(url), { params });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(this.formatUrl(url), body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(this.formatUrl(url), body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.formatUrl(url));
  }
}
