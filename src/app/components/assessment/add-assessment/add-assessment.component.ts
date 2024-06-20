import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Activity, Itinery, Product } from '../../../models/add-assessment';
import { ProductService } from '../../../services/add-assessment.service';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss'],
})
export class AddAssessmentComponent implements OnInit {
  isLinear = false;
  count = 0;
  countSecondFormSubmit = 0;

  product: Product = new Product(0, '', 0, '', 0, []);
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public itineryForm: FormGroup;
  public productLabels = ['Skiing', 'Boating', 'Bungee jumping'];
  public validationMsgs = {
    location: [{ type: 'text', message: 'Enter a valid day' }],
  };
  itineries: Itinery[] = [];
  arrActivities: Activity[] = [];
  panelOpenState = false;

  arrProducts: Product[] = [];

  selectedCar: number = 1;
  htmlItinery: Itinery[] = [];

  tempProduct: Product = new Product(0, '', 0, '', 0, []);

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    let data = this.productService.getProducts();
    this.arrProducts = data;
    console.log(data);

    this.itineryForm = this.formBuilder.group({
      itineries: this.formBuilder.array([this.createItineryFormGroup()]),
    });

    this.firstFormGroup = this.formBuilder.group({
      aNameCtrl: ['', Validators.required],
      marksCtrl: ['', Validators.required],
      timeCtrl: ['', Validators.required],
      cIdCtrl: ['', Validators.required],
    });

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.product = new Product(0, '', 0, '', 0, this.itineries);
  }

  private createItineryFormGroup(): FormGroup {
    this.count++;
    return this.formBuilder.group({
      category: ['', Validators.required],
      question: ['', Validators.required],
      optionA: [''],
      optionB: [''],
      optionC: [''],
      optionD: [''],
      optionTrue: ['True'],
      optionFalse: ['False'],
    });
  }

  ngOnInit(): void {}

  itineriesArr(): FormArray {
    return this.itineryForm.get('itineries') as FormArray;
  }

  public addItineryFormGroup() {
    this.itineriesArr().push(this.createItineryFormGroup());
  }

  public removeOrClearItinery(i: number) {
    const product_itineries = this.itineriesArr();
    if (product_itineries.length > 1) {
      product_itineries.removeAt(i);
    } else {
      product_itineries.reset();
    }
  }

  saveFirstStepData(formdata: FormGroup) {
    console.log(formdata.value);

    this.product.aName = formdata.value.aNameCtrl;
    this.product.marks = formdata.value.marksCtrl;
    this.product.time = formdata.value.timeCtrl;
    this.product.course_id = formdata.value.cIdCtrl;
    console.log(this.product);
  }

  saveSecondStepData(formdata: any) {
    if (this.itineryForm.valid) {
      const formData = this.itineryForm.value;
      console.log(formdata.itineries);

      formdata.itineries.forEach((fmData: any) => {
        const category = fmData.category;
        const question = fmData.question;
        let options;

        if (category === 'mcq') {
          options = {
            optionA: fmData.optionA,
            optionB: fmData.optionB,
            optionC: fmData.optionC,
            optionD: fmData.optionD,
          };
        } else if (category === 'truefalse') {
          options = {
            optionTrue: 'True',
            optionFalse: 'False',
          };
        }

        this.itineries.push(new Itinery(0, category, question, options));
      });

      console.log('Itineries:', this.itineries);
      this.product.itinery = this.itineries;
      this.productService.addProduct(this.product);
      this.resetForm();
      console.log(this.arrProducts);
    } else {
    }
  }

  resetForm() {
    this.itineryForm.reset();
    this.itineries = [];
  }
}
