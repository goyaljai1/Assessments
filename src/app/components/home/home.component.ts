import { Component } from '@angular/core';
import { Assessment } from '../../models/assessment';
import { AssessmentService } from '../../services/assessment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  arrAssesments: Assessment[] = [];

  constructor(
    private assessmentservice: AssessmentService,
    private router: Router
  ) {
    this.arrAssesments = this.assessmentservice.getAssessments();
  }
  isActive(active: string) {
    if (active == 'true') {
      return true;
    } else {
      return false;
    }
  }
  displayDetails(aid: number) {
    console.log(aid);
    this.router.navigate(['view-assessment-details/' + aid]);
  }
}
