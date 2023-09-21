import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart: any = null;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getCartFromApi();
  }

  getCartFromApi() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.get('http://192.168.0.13:3000/cart', { headers }).subscribe(
        (response) => {
          this.cart = response;
        },
        (err) => {
          if (err.error.statusCode === 401) this.router.navigate(['/login']);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  changeQuantity(productId: string, quantity: number) {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const body = { productId, quantity };

      this.http
        .post('http://192.168.0.13:3000/cart/add', body, { headers })
        .subscribe(
          () => {
            this.getCartFromApi();
          },
          (err) => {
            if (err.error.statusCode === 401) this.router.navigate(['/login']);
          }
        );
    } else {
      this.router.navigate(['/login']);
    }
  }

  empty() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .delete('http://192.168.0.13:3000/cart/empty', {
          headers,
        })
        .subscribe((res) => {
          this.getCartFromApi();
        });
    }
  }

  finishPurchase() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .post('http://192.168.0.13:3000/historic', {}, { headers })
        .subscribe(
          () => {
            this.getCartFromApi();
            this.error = null;
          },
          (err) => {
            if ((err.error.message = 'Insufficient funds')) {
              this.error =
                'Saldo da conta insuficiente. Faça um depósito para poder finalizar a compra.';
            } else {
              this.error = 'Erro ao tentar se conectar com o servidor.';
            }
          }
        );
    }
  }
}
