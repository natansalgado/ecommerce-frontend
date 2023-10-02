import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-createstore',
  templateUrl: './createstore.component.html',
})
export class CreatestoreComponent {
  user: any = null;
  storeName = '';
  error = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (data) => {
        this.user = data;
        this.getStore();
      },
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      }
    );
  }

  getStore() {
    const headers = this.userService.createHeaders();

    this.http.get(`${apiUrl}/store/mystore`, { headers }).subscribe(
      () => {
        this.router.navigate(['/mystore']);
      },
      (err) => {
        if (err.error.statusCode == 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    );
  }

  submit() {
    if (this.storeName.length < 5) {
      this.error = 'O nome da loja deve conter no mínimo 5 letras.';
      return;
    }

    this.createStore();
  }

  createStore() {
    const headers = this.userService.createHeaders();
    const body = { name: this.storeName };

    this.http.post(`${apiUrl}/store`, body, { headers }).subscribe(
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
  }
}
