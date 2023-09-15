import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart: any = null;

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

      this.http.get('http://localhost:3000/cart', { headers }).subscribe(
        (response) => {
          this.cart = response;
        },
        (error) => {
          this.router.navigate(['/login']);
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
        .post('http://localhost:3000/cart/add', body, { headers })
        .subscribe(
          (res) => {
            this.getCartFromApi();
          },
          (error) => {}
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
        .delete('http://localhost:3000/cart/empty', {
          headers,
        })
        .subscribe((res) => {
          this.getCartFromApi();
        });
    }
  }

  finishPurchase() {
    console.log('R$', this.cart.total_price);
  }
}
