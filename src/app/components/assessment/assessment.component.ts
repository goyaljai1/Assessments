import { Component } from '@angular/core';
import { Assessment_cards } from '../../models/assessments';
import { CartService } from '../../services/cart.service';  // Add this line
import { LocalStorageService } from '../../services/local-storage-service.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss',
})
export class AssessmentComponent {
  arrAssessmentCards = [
    new Assessment_cards(
      'Card title',
      'Card Sub-title',
      'Some quick example text to build on the card title and make up the bulk of the cards content.'
    ),
    new Assessment_cards(
      'Card title',
      'Card Sub-title',
      'Some quick example text to build on the card title and make up the bulk of the cards content.'
    ),
    new Assessment_cards(
      'Card title',
      'Card Sub-title',
      'Some quick example text to build on the card title and make up the bulk of the cards content.'
    ),
  ];

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
  }
}
