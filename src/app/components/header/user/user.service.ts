import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: any = null;

  constructor(private http: HttpClient) {}

  getUser() {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http.get(`${apiUrl}/auth/profile`, { headers }).subscribe(
        (data: any) => {
          this.user = data;
        },
        (error) => {
          if (error.error.statusCode == 401) {
            localStorage.removeItem('token');
          }
        }
      );
    }
  }
}
