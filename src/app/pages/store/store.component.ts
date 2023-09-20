import { Component } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['../products/products.style.css'],
})
export class StoreComponent {
  store: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      try {
        this.store = await this.http
          .get<any>(`http://192.168.0.13:3000/store/${params['id']}`)
          .toPromise();
      } catch (error) {}
    });
  }

  calcRoundedStars(stars1: any, ratings: any) {
    return Math.round(stars1 / ratings);
  }

  calcStars(stars1: any, ratings: any) {
    return stars1 / ratings;
  }
}
