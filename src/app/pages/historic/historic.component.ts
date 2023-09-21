import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
})
export class HistoricComponent {
  historic: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      this.http.get('http://192.168.0.13:3000/historic', { headers }).subscribe(
        (res) => {
          this.historic = res;
        },
        (err) => {
          if (err.error.statusCode === 401) this.router.navigate(['/login']);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }
}
