import { Component, OnInit } from '@angular/core';
import { Purchase, PurchaseItem } from '../../../models/cart';
import { DashboardService } from '../../../services/dashboard.service';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { AssessmentScore } from '../../../models/assessment-score';
import { AssessmentScoreService } from '../../../services/assessment-score.service';
import { ProductService } from '../../../services/add-assessment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../../../models/add-assessment';
import { AttendanceService } from '../../../services/attendance.service';
import { Attendance } from '../../../models/attendance';

import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-attendance-screen',
  templateUrl: './attendance-screen.component.html',
  styleUrl: './attendance-screen.component.scss',
})
export class AttendanceScreenComponent implements OnInit {
  userId: any;
  userName: any;
  arrAttendanceScore: Attendance[] = [];
  assessments: PurchaseItem[] = [];
  arrAssessment: Product[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private attendanceservice: AttendanceService
  ) {}

  ngOnInit(): void {
    this.userName = this.localStorageService.getItem('name');
    this.userId = this.localStorageService.getItem('userId');
    this.attendanceservice.getAttendances().subscribe((data) => {
      this.arrAttendanceScore = data.filter(
        (attendance) => attendance.userId === this.userId
      );
      console.log(this.arrAttendanceScore);
    });
  }
}
