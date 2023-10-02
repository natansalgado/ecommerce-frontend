import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/products']);
    }
  }

  login() {
    this.loginService.login(this.email, this.password).subscribe(
      (res) => {
        localStorage.setItem('token', res.accessToken);
        this.userService.triggerUpdate();
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
    this.router.navigate([lastUrl || '/products']);
  }
}
