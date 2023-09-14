import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  user: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http
        .get('http://localhost:3000/auth/profile', { headers })
        .subscribe(
          (data: any) => {
            this.user = data;
          },
          (error) => {
            localStorage.removeItem('token');
          }
        );
    }
  }
}
