import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../products/products.style.css'],
})
export class ProductComponent {
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
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getProduct();
    this.checkIsLogged();
  }

  getProduct() {
    this.route.params.subscribe(async (params) => {
      try {
        this.product = await this.http
          .get<any>(`${apiUrl}/product/${params['id']}`)
          .toPromise();
        this.checkIfProductIsInCart();
      } catch (error) {}
    });
  }

  checkIfProductIsInCart() {
    const headers = this.userService.createHeaders();

    this.http
      .get(`${apiUrl}/cart/product/${this.product.id}`, {
        headers,
      })
      .subscribe((res) => {
        this.productInCart = res;
      });
  }

  checkIsLogged(): void {
    const headers = this.userService.createHeaders();

    this.http
      .get(`${apiUrl}/auth/profile`, {
        headers,
      })
      .subscribe(
        (data) => {
          this.isLogged = true;
        },
        (err) => {
          localStorage.removeItem('token');
          this.isLogged = false;
        }
      );
  }

  changeQuantity(quantity: number) {
    this.quantity += quantity;
  }

  addToCart() {
    const headers = this.userService.createHeaders();

    const body = {
      productId: this.product.id,
      quantity: Number(this.quantity),
    };

    if (this.quantity > this.product.quantity) {
      this.errorMessage = 'Este produto não possui unidades o suficiente!';
      return;
    }

    this.http.post(`${apiUrl}/cart/add`, body, { headers }).subscribe(
      (response) => {
        this.addedQuantity = this.quantity;
        this.added = true;
        this.errorMessage = '';
        this.getProduct();
      },
      (err) => {
        if (err.error.message == 'Insuficient product quantity') {
          this.errorMessage = 'Este produto não possui unidades o suficiente!';
        } else if (err.error.statusCode == 401) {
          this.errorMessage = 'Faça o login para poder adicionar ao carrinho!';
        } else {
          this.errorMessage = err.error.message;
        }
        this.added = false;
      }
    );
  }

  calcRoundedStars(stars1: any, ratings: any) {
    return Math.round(stars1 / ratings);
  }

  calcStars(stars1: any, ratings: any) {
    return stars1 / ratings;
  }
}
