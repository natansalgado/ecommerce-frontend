import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/components/header/user/user.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.component.html',
})
export class HistoricComponent {
  historic: any = null;
  bought = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('bought')) {
      localStorage.removeItem('bought');
      this.bought = true;
    }

    const headers = this.userService.createHeaders();

    this.http.get(`${apiUrl}/historic`, { headers }).subscribe(
      (res) => {
        this.historic = res;
      },
      (err) => {
        if (err.error.statusCode === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
