import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
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
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/products']);
    }
  }

  register(): void {
    if (this.form.valid) {
      const userData = this.form.value;

      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };

      const lastUrl = localStorage.getItem('lastUrl');

      this.http
        .post('http://192.168.0.13:3000/user', userData, httpOptions)
        .subscribe(
          async (res: any) => {
            this.http
              .post('http://192.168.0.13:3000/auth/login', {
                email: userData.email,
                password: userData.password,
              })
              .subscribe((res: any) => {
                localStorage.setItem('token', res.accessToken);
              });
            this.router.navigate([lastUrl]);
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

  back() {
    const lastUrl = localStorage.getItem('lastUrl');
    if (lastUrl) {
      this.router.navigate([lastUrl]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
