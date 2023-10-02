import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser().subscribe(
      (data) => {
        this.user = data;
        this.getStore();
      },
      (err) => {
        if (err.error.statusCode == 401) {
          this.router.navigate(['/login']);
          localStorage.removeItem('token');
        }
        this.router.navigate(['/mystore']);
      }
    );
  }

  getStore() {
    const headers = this.userService.createHeaders();

    this.http.get(`${apiUrl}/store/mystore`, { headers }).subscribe(
      (data) => {
        this.store = data;
      },
      () => {
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
      this.product.quantity > 0 &&
      this.product.image_url.length <= 191
    ) {
      return false;
    }

    return true;
  }

  createProduct() {
    const headers = this.userService.createHeaders();

    this.http.post(`${apiUrl}/product`, this.product, { headers }).subscribe(
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
  }
}
