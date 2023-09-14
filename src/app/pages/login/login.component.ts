import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/products']);
    }
  }

  login(): void {
    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post<any>('http://localhost:3000/auth/login', loginData)
      .subscribe(
        (res: any) => {
          localStorage.setItem('token', res.accessToken);
          window.history.back();
        },
        (err) => {
          this.error = 'Usuário ou senha inválido.';
        }
      );
  }
}
