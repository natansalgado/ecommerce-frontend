import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  product: any = null;
  isLogged = false;
  quantity = 1;

  addedQuantity = 0;

  added = false;
  productInCart: any = null;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getApi();
    this.checkIsLogged();
  }

  getApi() {
    this.route.params.subscribe(async (params) => {
      try {
        this.product = await this.http
          .get<any>(`http://192.168.0.13:3000/product/${params['id']}`)
          .toPromise();
        this.checkIfProductIsInCart();
      } catch (error) {}
    });
  }

  checkIfProductIsInCart() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .get(`http://192.168.0.13:3000/cart/product/${this.product.id}`, {
          headers,
        })
        .subscribe(
          (res) => {
            this.productInCart = res;
          },
          (error) => {}
        );
    } else {
      this.isLogged = false;
    }
  }

  checkIsLogged(): void {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http
        .get('http://192.168.0.13:3000/auth/profile', {
          headers,
        })
        .subscribe(
          (data) => {
            this.isLogged = true;
          },
          (error) => {
            localStorage.removeItem('token');
            this.isLogged = false;
          }
        );
    } else {
      this.isLogged = false;
    }
  }

  changeQuantity(quantity: number) {
    this.quantity += quantity;
  }

  addToCart() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      productId: this.product.id,
      quantity: Number(this.quantity),
    };

    this.http
      .post('http://192.168.0.13:3000/cart/add', body, { headers })
      .subscribe(
        (response) => {
          this.addedQuantity = this.quantity;
          this.added = true;
          this.errorMessage = '';
          this.getApi();
        },
        (error) => {
          console.error(error);
          if (error.error.message === 'Insuficient product quantity') {
            this.errorMessage =
              'Este produto não possui unidades o suficiente!';
            this.added = false;
          }
        }
      );
  }
}
