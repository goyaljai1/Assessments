import { Component, OnInit } from '@angular/core';
import { Purchase, PurchaseItem } from '../../../models/cart';
import { DashboardService } from '../../../services/dashboard.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-attendance-screen',
  templateUrl: './attendance-screen.component.html',
  styleUrl: './attendance-screen.component.scss',
})
export class AttendanceScreenComponent implements OnInit {
  userId: string = '1'; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];
  userName: string = 'name';

  constructor(
    private assessmentService: DashboardService,
    private localStorageService: LocalStorageService
  ) {}
  private getUserName(): void {
    const name = this.localStorageService.getItem('name');
    if (name) {
      this.userName = name;
    } else {
      this.userName = '';
    }
  }
  ngOnInit(): void {
    this.getUserName();
    this.loadUserAssessments();
  }
  seeAssessments() {
    console.log('Hello');
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
