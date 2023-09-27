import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
})
export class UpdateproductComponent {
  user: any = null;
  store: any = null;
  initialProduct: any = null;

  product = {
    id: '',
    store_id: '',
    title: '',
    description: '',
    price: null,
    image_url: '',
    quantity: null,
  };

  showImage = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUser();
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
            this.getStore(headers);
          },
          (error) => {
            if (error.error.statusCode == 401) {
              this.router.navigate(['/login']);
              localStorage.removeItem('token');
            }
            this.router.navigate(['/mystore']);
          }
        );
    } else {
      this.router.navigate(['/login']);
    }
  }

  getStore(headers: HttpHeaders) {
    this.http
      .get('http://192.168.0.13:3000/store/mystore', { headers })
      .subscribe(
        (data: any) => {
          this.store = data;
          this.getProduct();
        },
        (error) => {
          this.store = null;
          this.router.navigate(['/mystore']);
        }
      );
  }

  getProduct() {
    this.route.params.subscribe(async (params) => {
      try {
        this.http
          .get<any>(`http://192.168.0.13:3000/product/${params['id']}`)
          .subscribe((data: any) => {
            this.product = data;
            this.initialProduct = { ...data };
          });
      } catch (error) {}
    });
  }

  submit() {
    if (this.checkIfIsNotValid()) return;

    this.updateProduct();
  }

  checkIfIsNotValid() {
    if (
      this.product.title.length >= 3 &&
      this.product.description.length >= 3 &&
      this.product.price != null &&
      this.product.price > 0 &&
      this.product.image_url.length > 0 &&
      this.showImage &&
      this.product.quantity != null &&
      this.product.quantity > 0 &&
      this.product.image_url.length <= 191
    ) {
      return false;
    }

    return true;
  }

  somethingChanged() {
    if (
      this.initialProduct.title == this.product.title &&
      this.initialProduct.description == this.product.description &&
      this.initialProduct.price == this.product.price &&
      this.initialProduct.image_url == this.product.image_url &&
      this.initialProduct.quantity == this.product.quantity
    ) {
      return true;
    }
    return false;
  }

  updateProduct() {
    const token = localStorage.getItem('token');

    const { title, description, price, image_url, quantity } = this.product;

    const product = {
      title,
      description,
      price,
      image_url,
      quantity,
    };

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .put(`http://192.168.0.13:3000/product/${this.product.id}`, product, {
          headers,
        })
        .subscribe(
          () => {
            localStorage.setItem('productUpdated', 'true');
            this.router.navigate(['/mystore']);
          },
          (err) => {
            if (err.error.statusCode == 401) {
              this.router.navigate(['/login']);
            } else {
              this.error = err.error.message;
            }
          }
        );
    } else {
      this.router.navigate(['/login']);
    }
  }
}
