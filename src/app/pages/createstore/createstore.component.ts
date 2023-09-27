import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createstore',
  templateUrl: './createstore.component.html',
})
export class CreatestoreComponent {
  user: any = null;
  storeName = '';
  error = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.getUser();
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
            this.verifyUserHasStore();
          },
          (error) => {
            localStorage.removeItem('token');
            this.router.navigate(['login']);
          }
        );
    } else {
      this.router.navigate(['login']);
    }
  }

  verifyUserHasStore() {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http
        .get('http://192.168.0.13:3000/store/mystore', { headers })
        .subscribe(
          (data: any) => {
            this.router.navigate(['/mystore']);
          },
          (error) => {
            if (error.error.statusCode == 401) {
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
            }
          }
        );
    } else {
      this.router.navigate(['/login']);
    }
  }

  submit() {
    if (this.storeName.length < 5) {
      this.error = 'O nome da loja deve conter no mínimo 5 letras.';
      return;
    }

    this.createStore();
  }

  createStore() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const body = { name: this.storeName };

      this.http
        .post('http://192.168.0.13:3000/store', body, { headers })
        .subscribe(
          () => {
            localStorage.setItem('storeCreated', 'true');
            this.router.navigate(['/mystore']);
          },
          (err) => {
            if (err.error.message.includes('is already in use')) {
              this.error = 'Este nome já está em uso.';
            } else if (err.error.statusCode == 401) {
              this.router.navigate(['/login']);
            } else {
              this.error = err.error.message;
            }
          }
        );
    } else {
      this.router.navigate(['/login']);
    }
  }
}
