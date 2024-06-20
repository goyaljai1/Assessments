import { Component } from '@angular/core';
import { Assessment_cards } from '../../models/assessments';
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

  displayDetails(cardTitle: string, cardSTitle: string) {
    alert(`Card Title: ${cardTitle}. Card Sub-Title: ${cardSTitle}`);
  }

  displayCartDetails(cardTitle: string) {
    alert(`Assessment ${cardTitle} added to cart successfully!`);
  }
}
