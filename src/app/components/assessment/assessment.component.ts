<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
=======
import { Component } from '@angular/core';
import { Assessment_cards } from '../../models/assessments';
import { CartService } from '../../services/cart.service';  // Add this line
import { LocalStorageService } from '../../services/local-storage-service.service';

>>>>>>> c44957f5b96ff5e729875a59b819391db72cd052
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss',
})
export class AssessmentComponent implements OnInit {
  arrProducts: Product[] = [];

<<<<<<< HEAD
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.arrProducts = data;
      console.log(this.arrProducts);
    });
=======
  constructor(private cartService: CartService, private localStorageService: LocalStorageService) {} 

  displayDetails(cardTitle: string, cardSTitle: string) {
    alert(`Card Title: ${cardTitle}. Card Sub-Title: ${cardSTitle}`);
  }

  displayCartDetails(card: Assessment_cards) {
    const role = this.localStorageService.getItem('role');
    if (role === null) {
      alert('Please login to add items to the cart.');
      return;
    }
    this.cartService.addToCart(card);
    alert(`Assessment ${card.cardTitle} added to cart successfully!`);
>>>>>>> c44957f5b96ff5e729875a59b819391db72cd052
  }
}
