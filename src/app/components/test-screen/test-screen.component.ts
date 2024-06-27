import { Component, OnInit } from '@angular/core';
import { Purchase, PurchaseItem } from '../../models/cart';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test-screen',
  templateUrl: './test-screen.component.html',
  styleUrl: './test-screen.component.scss',
})
export class TestScreenComponent implements OnInit {
  userId: string = '1'; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];
  userName: string = 'name';
  arrAssessment: Product[] = [];
  selectedAssessment: Product | null = null;
  itemForm: FormGroup[] = [];
  attemptedAssessments: Set<string> = new Set<string>();

  constructor(
    private assessmentService: DashboardService,
    private localStorageService: LocalStorageService,
    private productService: ProductService,
    private _formBuilder: FormBuilder
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
            this.filterAssessments();
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
      console.log('Filtered Assessments: ', this.arrAssessment);
    });
  }

  attemptAssessment(assessmentId: string): void {
    console.log('Attempting assessment:', assessmentId);
    this.selectedAssessment =
      this.arrAssessment.find((product) => product.id === assessmentId) || null;
    if (this.selectedAssessment) {
      this.itemForm = this.selectedAssessment.itinery.map(() =>
        this._formBuilder.group({
          selectedOption: [''],
        })
      );
      this.attemptedAssessments.add(assessmentId);
    }
  }

  goBack(): void {
    this.selectedAssessment = null;
    this.itemForm = [];
  }

  submitAssessment(): void {
    // Implement assessment submission logic here
    console.log('Assessment submitted');
  }

  isAttempted(assessmentId: string): boolean {
    return this.attemptedAssessments.has(assessmentId);
  }
}
