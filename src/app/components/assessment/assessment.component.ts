import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/add-assessment';
import { Assessment_cards } from '../../models/assessments';
import { CartService } from '../../services/cart.service';  // Add this line
import { LocalStorageService } from '../../services/local-storage-service.service';

>>>>>>> c44957f5b96ff5e729875a59b819391db72cd052
@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss',
})
export class AssessmentComponent implements OnInit {
  arrProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.arrProducts = data;
      console.log(this.arrProducts);
    });
  }
}
