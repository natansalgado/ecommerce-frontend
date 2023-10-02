import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

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
    private route: ActivatedRoute,
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
        this.getProduct();
      },
      () => {
        this.store = null;
        this.router.navigate(['/mystore']);
      }
    );
  }

  getProduct() {
    this.route.params.subscribe(async (params) => {
      try {
        this.http
          .get<any>(`${apiUrl}/product/${params['id']}`)
          .subscribe((data) => {
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
    const headers = this.userService.createHeaders();

    const { title, description, price, image_url, quantity } = this.product;

    const product = {
      title,
      description,
      price,
      image_url,
      quantity,
    };

    this.http
      .put(`${apiUrl}/product/${this.product.id}`, product, {
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
  }
}
