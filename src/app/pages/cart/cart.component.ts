import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart: any = null;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

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
            this.userService.getUser();
            this.getCartFromApi();
            this.error = null;
            localStorage.setItem('bought', 'true');
            this.router.navigate(['/historic']);
          },
          (err) => {
            if ((err.error.message = 'Insufficient funds')) {
              this.error =
                'Saldo da conta insuficiente. Faça um depósito para poder finalizar a compra.';
            } else if (err.error.statusCode == 401) {
              this.router.navigate(['/login']);
            } else {
              this.error = 'Erro ao tentar se conectar com o servidor.';
            }
          }
        );
    } else this.router.navigate(['/login']);
  }
}
