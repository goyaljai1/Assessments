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
export class UpdateAssessmentComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  itineryForm: FormGroup;
  arrProducts: Product[] = [];
  selectedProduct: Product | null = null;
  selectedItinery: FormGroup | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.firstFormGroup = this.formBuilder.group({
      assessmentIdCtrl: ['', Validators.required],
      aNameCtrl: ['', Validators.required],
      marksCtrl: ['', Validators.required],
      timeCtrl: ['', Validators.required],
      cIdCtrl: ['', Validators.required],
      priceCtrl: ['', Validators.required],
      aDesCtrl: ['', Validators.required],
      imgSrcCtrl: ['', Validators.required],
    });

    this.itineryForm = this.formBuilder.group({
      itineries: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.arrProducts = products;
    });

    const assessmentId = this.route.snapshot.params['id'];
    if (assessmentId) {
      this.productService.getProductById(assessmentId).subscribe((product) => {
        this.selectedProduct = product;
        this.updateFormGroup(this.selectedProduct);
      });
    }
  }

  updateFormGroup(product: Product): void {
    this.firstFormGroup.patchValue({
      assessmentIdCtrl: product.id,
      aNameCtrl: product.aName,
      marksCtrl: product.marks,
      timeCtrl: product.time,
      cIdCtrl: product.course_id,
      priceCtrl: product.aPrice,
      aDesCtrl: product.aDes,
      imgSrcCtrl: product.aImgSrc,
    });

    this.setItineries(product.itinery);
  }

  setItineries(itineries: Itinery[]): void {
    const itineryFormArray = this.itineryForm.get('itineries') as FormArray;
    itineryFormArray.clear();
    itineries.forEach((itinery) => {
      itineryFormArray.push(this.createItineryFormGroup(itinery));
    });
  }

  createItineryFormGroup(itinery: Itinery): FormGroup {
    return this.formBuilder.group({
      id: [itinery.id || ''],
      category: [itinery.category, Validators.required],
      question: [itinery.question, Validators.required],
      optionA: [itinery.options.optionA],
      optionB: [itinery.options.optionB],
      optionC: [itinery.options.optionC],
      optionD: [itinery.options.optionD],
      optionTrue: [itinery.options.optionTrue],
      optionFalse: [itinery.options.optionFalse],
      correctAns: [itinery.correctAns || ''],
    });
  }

  itineriesArr(): FormArray {
    return this.itineryForm.get('itineries') as FormArray;
  }

  addItineryFormGroup(): void {
    this.itineriesArr().push(
      this.createItineryFormGroup({
        id: '',
        category: 'mcq',
        question: '',
        options: {
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          optionTrue: '',
          optionFalse: '',
        },
        correctAns: '',
      } as Itinery)
    );
  }

  removeOrClearItinery(i: number): void {
    const itineries = this.itineriesArr();
    if (itineries.length > 1) {
      itineries.removeAt(i);
    } else {
      itineries.reset();
    }
  }

  saveFirstStepData(): void {
    if (this.selectedProduct) {
      this.selectedProduct.aName = this.firstFormGroup.value.aNameCtrl;
      this.selectedProduct.marks = this.firstFormGroup.value.marksCtrl;
      this.selectedProduct.time = this.firstFormGroup.value.timeCtrl;
      this.selectedProduct.course_id = this.firstFormGroup.value.cIdCtrl;
      this.selectedProduct.aPrice = this.firstFormGroup.value.priceCtrl;
      this.selectedProduct.aDes = this.firstFormGroup.value.aDesCtrl;
      this.selectedProduct.aImgSrc = this.firstFormGroup.value.imgSrcCtrl;

      this.productService.updateProduct(this.selectedProduct).subscribe(() => {
        console.log('First step data saved successfully');
      });
    }
  }

  submitAssessment(): void {
    if (this.selectedProduct) {
      this.selectedProduct.itinery = this.itineryForm.value.itineries;
      this.productService.updateProduct(this.selectedProduct).subscribe(() => {
        console.log('Assessment updated successfully');
      });
    }
  }

  onAssessmentChange(event: any): void {
    const selectedAssessmentId = event.value;
    this.selectedProduct = this.arrProducts.find(
      (product) => product.id === selectedAssessmentId
    ) || null;  // Use null as fallback

    if (this.selectedProduct) {
      this.updateFormGroup(this.selectedProduct);
    }
  }

  onItineryChange(event: any): void {
    const selectedItineryId = event.value;
    this.selectedItinery = this.itineriesArr().controls.find(
      (ctrl) => ctrl.value.id === selectedItineryId
    ) as FormGroup;
  }
}
