import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-storesales',
  templateUrl: './storesales.component.html',
})
export class StoresalesComponent {
  user: any = null;
  store: any = null;
  sales: any = null;

  showTotal = false;

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
        this.getSales(headers);
      },
      (error) => {
        this.store = null;
        this.router.navigate(['/mystore']);
      }
    );
  }

  getSales(headers: HttpHeaders) {
    this.http.get(`${apiUrl}/sale`, { headers }).subscribe(
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
