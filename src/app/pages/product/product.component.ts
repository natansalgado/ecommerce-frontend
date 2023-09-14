import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  product: any = null;
  isLogged: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      try {
        this.product = await this.http
          .get<any>(`http://localhost:3000/product/${params['id']}`)
          .toPromise();
      } catch (error) {
      }
    });

    this.checkIsLogged();
  }

  checkIsLogged(): void {
    const authToken = localStorage.getItem('token');

    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http
        .get('http://localhost:3000/auth/profile', {
          headers,
        })
        .subscribe(
          (data: any) => {
            this.isLogged = true;
          },
          (error) => {
            localStorage.removeItem('token');
            this.isLogged = false;
          }
        );
    } else {
      this.isLogged = false;
    }
  }
}
