import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  form: FormGroup | null = null;
  error: string = '';

  user: any = null;
  cards: any = [];
  value = 0;
  opened = '';
  depositMessage = '';
  depositSuccessMessage = '';
  verifying = false;

  currentPassword = true;
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.generateCard();
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (data) => {
        this.user = data;
        this.createForm();
      },
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    );
  }

  createForm() {
    this.form = this.fb.group({
      name: [
        this.user.name,
        [
          Validators.required,
          Validators.pattern(/^[A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)+$/),
        ],
      ],
      email: [
        this.user.email,
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: [
        '',
        [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)],
      ],
      repeatPassword: [''],
      address: [this.user.address, Validators.required],
      currentPassword: [''],
    });
  }

  verifyAccount() {
    const loginData = {
      email: this.user.email,
      password: this.form?.value.currentPassword,
    };

    this.http.post<any>(`${apiUrl}/auth/login`, loginData).subscribe(
      (res: any) => {
        this.update();
        this.currentPassword = true;
        this.successMessage = 'perfil atualizado com sucesso.';
      },
      (err) => {
        if (err.error.message === 'Invalid email or password') {
          this.currentPassword = false;
          this.successMessage = '';
        } else {
          this.error =
            'Problemas ao tentar acessar o servidor, tente novamente mais tarde.';
        }
      }
    );
  }

  update() {
    if (this.form?.valid) {
      if (
        this.form?.value.password &&
        this.form?.value.password !== this.form?.value.repeatPassword
      ) {
        return;
      }

      if (this.form?.value.repeatPassword && !this.form?.value.password) {
        return;
      }

      const headers = this.userService.createHeaders();

      const data = { ...this.form.value };

      data.repeatPassword = undefined;
      data.currentPassword = undefined;

      this.http
        .put(`${apiUrl}/user/${this.user.id}`, data, {
          headers,
        })
        .subscribe(
          (res) => {
            this.form?.get('password')?.setValue('');
            this.form?.get('repeatPassword')?.setValue('');
            this.form?.get('currentPassword')?.setValue('');
            this.userService.triggerUpdate();
          },
          (err) => {
            if (err.error.statusCode === 401) this.router.navigate(['/login']);
          }
        );
    }
  }

  canSave() {
    if (
      (this.form?.value.name === this.user.name &&
        this.form?.value.email === this.user.email &&
        this.form?.value.address === this.user.address) ||
      !this.form?.value.currentPassword
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkPasswords() {
    if (this.form?.value.password !== this.form?.value.repeatPassword)
      return true;
    else return false;
  }

  setOpened(opened: string) {
    this.opened = opened;
  }

  generateCard() {
    const card = {
      number: Math.floor(Math.random() * 9999),
      date:
        Math.round(Math.random() * 12) + '/' + Math.round(Math.random() * 30),
      active: false,
      id: Math.round(Math.random() * 9999999),
    };

    this.cards.push(card);
  }

  deleteCard(id: number) {
    this.cards = this.cards.filter((card: any) => card.id !== id);
  }

  activeCard(id: number) {
    for (let card of this.cards) {
      card.active = false;
    }

    this.cards.map((card: any) => {
      if (card.id === id) card.active = true;
    });
  }

  verifyDeposit() {
    if (this.verifying) return;

    this.depositMessage = '';
    this.depositSuccessMessage = '';

    let someActived = false;

    for (let card of this.cards) {
      if (card.active) someActived = true;
    }

    if (!someActived) {
      this.depositMessage =
        'Escolha um cartão para poder finalizar o deposito.';
      return;
    }

    if (this.value < 10) {
      this.depositMessage =
        'O valor de depósito deve ser de no mínimo R$ 10.00';
      return;
    }

    this.verifying = true;

    setTimeout(() => {
      this.verifying = false;

      if (!(Math.random() < 0.33)) {
        this.depositMessage =
          'Algo deu errado com a validação, tente novamente. Caso o erro persista tente com outro cartão.';
        return;
      }

      this.deposit();
    }, 3000);
  }

  someCardActived() {
    let someActived = false;

    this.cards.map((card: any) => {
      if (card.active) someActived = true;
    });

    return someActived;
  }

  deposit() {
    const headers = this.userService.createHeaders();

    this.http
      .post(`${apiUrl}/deposit`, { value: this.value }, { headers })
      .subscribe(
        (res) => {
          this.depositSuccessMessage = `Depósito concluído com sucesso! valor: R$ ${this.value.toFixed(
            2
          )}`;
          this.userService.triggerUpdate();
          this.value = 0;
        },
        (err) => {
          this.depositMessage = `Ocorreu um erro: ${err.error.message}`;
          if (err.error.statusCode == 401) {
            this.router.navigate(['login']);
          }
        }
      );
  }
}
