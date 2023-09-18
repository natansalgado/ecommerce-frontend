import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http
        .get('http://192.168.0.13:3000/auth/profile', { headers })
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

  quit() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  login() {
    if (this.router.url !== '/login' && this.router.url !== '/register') {
      localStorage.setItem('lastUrl', this.router.url);
      this.router.navigate(['/login']);
    }
  }
}
