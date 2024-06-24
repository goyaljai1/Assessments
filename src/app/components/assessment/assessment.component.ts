import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/add-assessment';
import { Assessment_cards } from '../../models/assessments';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { ProductService } from '../../services/add-assessment.service';
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss',
})
export class AssessmentComponent implements OnInit {
  arrProducts: Product[] = [];

  constructor(private productService: ProductService,private localStorageService:LocalStorageService,private cartService: CartService ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.arrProducts = data;
      console.log(this.arrProducts);
    });
  }
  displayDetails(cardTitle: string, cardSTitle: string) {
    alert(`Card Title: ${cardTitle}. Card Sub-Title: ${cardSTitle}`);
  }

  displayCartDetails(product: Product) {
    const role = this.localStorageService.getItem('role');
    if (role === null) {
      alert('Please login to add items to the cart.');
      return;
    }
    this.cartService.addToCart(product);
    alert(`Assessment ${product.aName} added to cart successfully!`);
  }
  
}
