import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { apiUrl } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private updateSubject = new Subject<void>();
  update$ = this.updateSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  createHeaders() {
    const token = localStorage.getItem('token');

    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    } else {
      this.router.navigate(['/login']);
      return undefined;
    }
  }

  getUser(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${apiUrl}/auth/profile`, { headers });
  }

  triggerUpdate() {
    this.updateSubject.next();
  }
}
