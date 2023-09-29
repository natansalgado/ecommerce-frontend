import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

      this.http.get(`${apiUrl}/auth/profile`, { headers }).subscribe(
        (data: any) => {
          this.user = data;
          this.getStore(headers);
        },
        (error) => {
          if (error.error.statusCode == 401) {
            this.router.navigate(['login']);
            localStorage.removeItem('token');
          }
        }
      );
    } else {
      this.router.navigate(['login']);
    }
  }

  getStore(headers: HttpHeaders) {
    this.http.get(`${apiUrl}/store/mystore`, { headers }).subscribe(
      (data: any) => {
        this.store = data;
        this.getProduct(headers);
      },
      (error) => {
        this.store = null;
        this.router.navigate(['/mystore']);
      }
    );
  }

  getProduct(headers: HttpHeaders) {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`${apiUrl}/product/${id}`).subscribe(
      (data: any) => {
        this.product = data;
        this.getSales(headers);
      },
      (error) => {
        this.product = null;
      }
    );
  }

  getSales(headers: HttpHeaders) {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`${apiUrl}/sale/${id}`, { headers }).subscribe(
      (data: any) => {
        this.sales = data;
      },
      (error) => {
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
