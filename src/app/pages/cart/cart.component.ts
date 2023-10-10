import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent {
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
    const headers = this.userService.createHeaders();

    this.http.get(`${apiUrl}/cart`, { headers }).subscribe(
      (response) => {
        this.cart = response;
      },
      (err) => {
        if (err.error.statusCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  changeQuantity(productId: string, quantity: number) {
    const headers = this.userService.createHeaders();

    const body = { productId, quantity };

    this.http.post(`${apiUrl}/cart/add`, body, { headers }).subscribe(
      () => {
        this.getCartFromApi();
      },
      (err) => {
        if (err.error.statusCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }

  empty() {
    const headers = this.userService.createHeaders();

    this.http
      .delete(`${apiUrl}/cart/empty`, {
        headers,
      })
      .subscribe(() => {
        this.getCartFromApi();
      });
  }

  finishPurchase() {
    const headers = this.userService.createHeaders();

    this.http.post(`${apiUrl}/historic`, {}, { headers }).subscribe(
      () => {
        this.userService.triggerUpdate();
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
  }
}
