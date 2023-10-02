import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-storeproductsales',
  templateUrl: './storeproductsales.component.html',
})
export class StoreproductsalesComponent {
  user: any = null;
  store: any = null;
  product: any = null;
  sales: any = null;

  showTotal = false;

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
      () => {
        this.router.navigate(['login']);
        localStorage.removeItem('token');
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
      (err) => {
        this.store = null;
        this.router.navigate(['/mystore']);
      }
    );
  }

  getProduct() {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`${apiUrl}/product/${id}`).subscribe(
      (data) => {
        this.product = data;
        this.getSales();
      },
      (err) => {
        this.product = null;
      }
    );
  }

  getSales() {
    const id = this.route.snapshot.paramMap.get('id');
    const headers = this.userService.createHeaders();

    this.http.get(`${apiUrl}/sale/${id}`, { headers }).subscribe(
      (data) => {
        this.sales = data;
      },
      (err) => {
        this.sales = null;
      }
    );
  }

  calcAllSalesPrice() {
    let total = 0;

    for (let sale of this.sales) {
      total += Number(sale.price);
    }

    return total;
  }
}
