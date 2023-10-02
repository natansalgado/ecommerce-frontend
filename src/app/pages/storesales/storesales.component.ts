import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
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
        this.getSales();
      },
      () => {
        this.store = null;
        this.router.navigate(['/mystore']);
      }
    );
  }

  getSales() {
    const headers = this.userService.createHeaders();

    this.http.get(`${apiUrl}/sale`, { headers }).subscribe(
      (data) => {
        this.sales = data;
      },
      () => {
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
