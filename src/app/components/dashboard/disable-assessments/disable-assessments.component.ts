import { Component, OnInit } from '@angular/core';
import { PurchaseItem } from '../../../models/cart';
import { Product } from '../../../models/add-assessment';
import { DashboardService } from '../../../services/dashboard.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { ProductService } from '../../../services/add-assessment.service';

@Component({
  selector: 'app-disable-assessments',
  templateUrl: './disable-assessments.component.html',
  styleUrl: './disable-assessments.component.scss',
})
export class DisableAssessmentsComponent implements OnInit {
  userId: any; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];
  userRole: any;
  userName: string = 'name';
  arrAssessment: Product[] = [];
  attemptedAssessments: string[] = [];
  isFacultyOrAdmin: boolean = false;

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
    if (this.userRole == 'faculty' || this.userRole == 'admin') {
      this.isFacultyOrAdmin = true;
    }
  }

  ngOnInit(): void {
    this.getUserName();
    console.log(this.userId);
  }
}
