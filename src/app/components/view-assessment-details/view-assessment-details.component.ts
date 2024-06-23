import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Assessment } from '../../models/assessment';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-view-assessment-details',
  templateUrl: './view-assessment-details.component.html',
  styleUrl: './view-assessment-details.component.scss',
})
export class ViewAssessmentDetailsComponent {
  assessment:Assessment = new Assessment(0,'','','','');
  constructor(private activatedRoute: ActivatedRoute, private assessmentService: AssessmentService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params['id']);
      var aid = parseInt(params['id']);
      this.assessment = this.assessmentService.getAssessmentById(aid);
    });
  }
}
