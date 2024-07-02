import { Component, OnInit } from '@angular/core';
import { CartItem, Product } from '../../models/add-assessment';
import { CheckoutServiceService } from '../../services/checkout-service.service';
import { Purchase, PurchaseItem } from '../../models/cart';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { ProductService } from '../../services/add-assessment.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userId: any; // Replace with actual logic to get current logged-in user ID
  userRole: any;
  assessments: PurchaseItem[] = [];
  userName: string = 'name';
  arrAssessment: Product[] = [];
  attemptedAssessments: string[] = [];
  isFaculty: boolean = false;

  constructor(
    private assessmentService: DashboardService,
    private localStorageService: LocalStorageService,
    private productService: ProductService
  ) {}

  private getUserName(): void {
    const name = this.localStorageService.getItem('name');
    if (name) {
      this.userName = name;
    } else {
      this.userName = '';
    }
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');
  }

  ngOnInit(): void {
    this.getUserName();
    this.loadUserAssessments();
    this.filterAssessments();
    if (this.userRole) {
      this.isFaculty = true;
    }
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
  filterAssessments(): void {
    this.productService.getProducts().subscribe((data) => {
      this.arrAssessment = data.filter((product) =>
        this.assessments.some((a) => a.assessmentId === product.id)
      );
    });
  }
}
