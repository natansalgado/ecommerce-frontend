import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  user: any = null;
  cards: any = [];
  value = 0;
  opened = '';
  depositMessage = '';
  depositSuccessMessage = '';
  verifying = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.generateCard();
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
          },
          (error) => {
            localStorage.removeItem('token');
            this.router.navigate(['/products']);
          }
        );
    } else {
      this.router.navigate(['/products']);
    }
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
    const authToken = localStorage.getItem('token');

    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http
        .post(
          'http://192.168.0.13:3000/deposit',
          { value: this.value },
          { headers }
        )
        .subscribe(
          (res) => {
            this.depositSuccessMessage = `Depósito concluído com sucesso! valor: R$ ${this.value.toFixed(
              2
            )}`;
            this.userService.getUser();
            this.value = 0;
          },
          (err) => {
            this.depositMessage = `Ocorreu um erro: ${err.error.message}`;
          }
        );
    }
  }
}
