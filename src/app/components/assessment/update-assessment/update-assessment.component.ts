import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Itinery, Product } from '../../../models/add-assessment';
import { ProductService } from '../../../services/add-assessment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-assessment',
  templateUrl: './update-assessment.component.html',
  styleUrls: ['./update-assessment.component.scss'],
})
export class UpdateAssessmentComponent {

}
