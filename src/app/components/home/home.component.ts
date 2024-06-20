import { Component } from '@angular/core';
import { Assessment } from '../../models/assessment';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  arrAssesments: Assessment[] = [];

  constructor(private assessmentservice: AssessmentService) {
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
  }
}
