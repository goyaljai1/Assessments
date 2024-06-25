import { Component } from '@angular/core';
import { Product } from '../../../models/add-assessment';
import { ProductService } from '../../../services/add-assessment.service';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrl: './view-assessment.component.scss',
})
export class ViewAssessmentComponent {
  arrCourse: Product[] = [];
  constructor(private productservice: ProductService) {
    this.productservice.getProducts().subscribe((data) => {
      this.arrCourse = data;
      console.log(this.arrCourse);
    });
  }
}
