import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/components/header/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form: FormGroup;
  error: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)+$/),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ],
      ],
      repeatPassword: [''],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/products']);
    }
  }

  register() {
    if (this.form.valid && !this.checkPassword()) {
      const userData = { ...this.form.value };

      userData.repeatPassword = undefined;

      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };

      this.http
        .post('http://192.168.0.13:3000/user', userData, httpOptions)
        .subscribe(
          (res: any) => {
            this.login();
          },
          (error) => {
            if (error.error.message === 'Email already in use') {
              this.error = 'Este email já está sendo utilizado.';
            } else {
              this.error = 'Ocorreu um erro, tente novamente mais tarde.';
            }
          }
        );
    }
  }

  login(): void {
    const loginData = {
      email: this.form.value.email,
      password: this.form.value.password,
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

  checkPassword() {
    if (this.form.value.password !== this.form.value.repeatPassword) {
      return true;
    } else return false;
  }
}
