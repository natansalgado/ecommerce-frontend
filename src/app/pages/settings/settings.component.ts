import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  user: any = null;
  cards: any = [];
  value = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getUser();

    const cardsQuantity = Math.round(Math.random() * 3);

    for (let i = 0; i < cardsQuantity; i++) {
      this.generateCard();
    }

    if (cardsQuantity <= 0) {
      this.generateCard();
    }
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
          }
        );
    }
  }

  generateCard() {
    const card = {
      number: Math.floor(Math.random() * 9999),
      date:
        Math.round(Math.random() * 12) + '/' + Math.round(Math.random() * 30),
      active: false,
      index: this.cards.length,
    };

    this.cards.push(card);
  }

  activeCard(index: number) {
    for (let card of this.cards) {
      card.active = false;
    }

    this.cards[index].active = true;
  }

  deposit() {
    console.log(this.value);
  }
}
