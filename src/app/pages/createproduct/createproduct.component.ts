import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
})
export class CreateproductComponent {
  user: any = null;
  store: any = null;

  product = {
    title: '',
    description: '',
    price: null,
    image_url: '',
    quantity: null,
  };

  showImage = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

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
        },
        (error) => {
          this.store = null;
          this.router.navigate(['/mystore']);
        }
      );
  }

  onSubmit() {
    if (this.checkIfIsNotValid()) return;

    this.createProduct();
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
      this.product.quantity > 0
    ) {
      return false;
    }

    return true;
  }

  createProduct() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .post('http://192.168.0.13:3000/product', this.product, { headers })
        .subscribe(
          () => {
            localStorage.setItem('productCreated', 'true');
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
