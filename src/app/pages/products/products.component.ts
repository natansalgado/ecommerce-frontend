import { Component } from '@angular/core';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.style.css'],
})
export class ProductsComponent {
  products: any[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.map((product: any) => {
        return product;
      });
    });
  }

  calcRoundedStars(stars1: any, ratings: any) {
    return Math.round(stars1 / ratings);
  }

  calcStars(stars1: any, ratings: any) {
    return stars1 / ratings;
  }
}
