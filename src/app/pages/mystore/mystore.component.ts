import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mystore',
  templateUrl: './mystore.component.html',
})
export class MystoreComponent {
  user: any = null;
  store: any = null;
  storeCreated = false;
  productCreated = false;
  productUpdated = false;
  showBalance = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getUser();

    if (localStorage.getItem('storeCreated')) {
      localStorage.removeItem('storeCreated');
      this.storeCreated = true;
    }

    if (localStorage.getItem('productCreated')) {
      localStorage.removeItem('productCreated');
      this.productCreated = true;
    }

    if (localStorage.getItem('productUpdated')) {
      localStorage.removeItem('productUpdated');
      this.productUpdated = true;
    }
  }

  getUser() {
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
            this.getStore(headers);
          },
          (error) => {
            if (error.error.statusCode == 401) {
              this.router.navigate(['login']);
              localStorage.removeItem('token');
            }
          }
        );
    } else {
      this.router.navigate(['login']);
    }
  }

  getStore(headers: HttpHeaders) {
    this.http
      .get('http://192.168.0.13:3000/store/mystore', { headers })
      .subscribe(
        (data: any) => {
          this.store = data;
        },
        (error) => {
          this.store = null;
        }
      );
  }
}
