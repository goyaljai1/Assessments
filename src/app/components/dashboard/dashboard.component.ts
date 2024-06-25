import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/add-assessment';
import { CheckoutServiceService } from '../../services/checkout-service.service';
import { Purchase, PurchaseItem } from '../../models/cart';
import { DashboardService } from '../../services/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userId: string = '1'; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];

  constructor(private assessmentService: DashboardService) {}

  ngOnInit(): void {
    this.loadUserAssessments();
  }

  loadUserAssessments(): void {
    this.assessmentService.getUserAssessments(this.userId).subscribe(
      (purchases: Purchase[]) => {
        console.log('purchases: ', purchases);
        if (purchases.length > 0) {
          const purchase = purchases[0];
          console.log(purchase);
          if (purchase && purchase.items) {
            this.assessments = purchase.items;
          }
        }
      },
      (error) => {
        console.error('Error fetching assessments:', error);
      }
    );
  }
}
