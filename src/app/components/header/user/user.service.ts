import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { apiUrl } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private updateSubject = new Subject<void>();
  update$ = this.updateSubject.asObservable();

  constructor(private http: HttpClient) {}

  createHeaders() {
    const token = localStorage.getItem('token');

    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    } else {
      return undefined;
    }
  }

  getUser(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${apiUrl}/auth/profile`, { headers });
  }

  triggerUpdate() {
    this.updateSubject.next();
  }
}
