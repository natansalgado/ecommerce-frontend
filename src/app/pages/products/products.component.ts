import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./product.style.css'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.map((product: any) => {
        product.image_urls = product.image_urls.split(',');
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
