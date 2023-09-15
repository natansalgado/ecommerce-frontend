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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
        .post('http://localhost:3000/user', userData, httpOptions)
        .subscribe(
          async (res: any) => {
            this.http
              .post('http://localhost:3000/auth/login', {
                email: userData.email,
                password: userData.password,
              })
              .subscribe(
                (res: any) => {
                  localStorage.setItem('token', res.accessToken);
                },
                (err) => {
                  this.error =
                    'Ocorreu um erro durante o login após o registro. Por favor, tente novamente mais tarde.';
                }
              );
              this.router.navigate([lastUrl]);
          },
          (error) => {
            this.error = error;
          }
        );
    }
  }

  back() {
    const lastUrl = localStorage.getItem('lastUrl');
    this.router.navigate([lastUrl]);
  }
}
