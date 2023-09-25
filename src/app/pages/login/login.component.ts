import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

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
      .post<any>('http://192.168.0.13:3000/auth/login', loginData)
      .subscribe(
        (res: any) => {
          this.userService.getUser();
          localStorage.setItem('token', res.accessToken);
          this.back();
        },
        (err) => {
          if (err.error.message === 'Invalid email or password') {
            this.error = 'Usuário ou senha inválido.';
          } else {
            this.error =
              'Problemas ao tentar acessar o servidor, tente novamente mais tarde.';
          }
        }
      );
  }

  back() {
    const lastUrl = localStorage.getItem('lastUrl');
    if (lastUrl) {
      this.router.navigate([lastUrl]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
