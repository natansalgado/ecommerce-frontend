import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-mystore',
  templateUrl: './mystore.component.html',
})
export class MystoreComponent {
  user: any = null;
  store: any = null;
  storeCreated = false;
  productCreated = false;
  productUpdated = false;
  showBalance = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getUser();

    if (localStorage.getItem('storeCreated')) {
      localStorage.removeItem('storeCreated');
      this.storeCreated = true;
    }

    if (localStorage.getItem('productCreated')) {
      localStorage.removeItem('productCreated');
      this.productCreated = true;
    }

    if (localStorage.getItem('productUpdated')) {
      localStorage.removeItem('productUpdated');
      this.productUpdated = true;
    }
  }

  getUser() {
    this.userService.getUser().subscribe(
      (data) => {
        this.user = data;
        this.getStore();
      },
      (err) => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    );
  }

  getStore() {
    const headers = this.userService.createHeaders();

    this.http.get(`${apiUrl}/store/mystore`, { headers }).subscribe(
      (data) => {
        this.store = data;
      },
      (err) => {
        this.store = null;
      }
    );
  }
}
