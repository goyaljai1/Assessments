import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Itinery, Product } from '../../../models/add-assessment';
import { ProductService } from '../../../services/add-assessment.service';
import { privateDecrypt } from 'crypto';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss'],
})
export class AddAssessmentComponent implements OnInit {
  isLinear = false;
  count = 0;
  countSecondFormSubmit = 0;
  userId: any;
  userRole: any;
  product: Product = new Product('', '', '', '', 0, '', true, 0, 0, '', []);
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public itineryForm: FormGroup;
  itineries: Itinery[] = [];
  panelOpenState = false;

  arrProducts: Product[] = [];

  selectedCar: number = 1;
  htmlItinery: Itinery[] = [];

  tempProduct: Product = new Product('', '', '', '', 0, '', true, 0, 0, '', []);

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private localStorageService: LocalStorageService
  ) {
    this.userId = this.localStorageService.getItem('userId');
    this.userRole = this.localStorageService.getItem('role');
    console.log(this.userId);
    this.itineryForm = this.formBuilder.group({
      itineries: this.formBuilder.array([this.createItineryFormGroup()]),
    });

    this.firstFormGroup = this.formBuilder.group({
      aNameCtrl: ['', Validators.required],
      marksCtrl: ['', Validators.required],
      timeCtrl: ['', Validators.required],
      cIdCtrl: ['', Validators.required],
      facultyIdCtrl: [],
      aDesCtrl: [''],
      priceCtrl: [''],
      imgSrcCtrl: [''],
    });

    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.product = new Product(
      '',
      '',
      '',
      '',
      0,
      '',
      true,
      0,
      0,
      '',
      this.itineries
    );
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.arrProducts = data;
      console.log(data);
    });
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
      correctAns: [''],
    });
  }

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

    this.product.id = this.generateUniqueId(this.arrProducts);
    this.product.aName = formdata.value.aNameCtrl;
    this.product.marks = formdata.value.marksCtrl;
    this.product.time = formdata.value.timeCtrl;
    this.product.course_id = formdata.value.cIdCtrl;
    this.product.faculty_id = formdata.value.facultyIdCtrl;
    this.product.aDes = formdata.value.aDesCtrl;
    this.product.aPrice = formdata.value.priceCtrl;
    this.product.aImgSrc = formdata.value.imgSrcCtrl;
    console.log(this.product);
  }

  saveSecondStepData(formdata: any) {
    if (this.itineryForm.valid) {
      const formData = this.itineryForm.value;
      console.log(formdata.itineries);

      formdata.itineries.forEach((fmData: any) => {
        const category = fmData.category;
        const question = fmData.question;
        const correctAns = fmData.correctAns;
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

        const itineryId = this.generateUniqueId(this.itineries);
        this.itineries.push(
          new Itinery(itineryId, category, question, options, correctAns)
        );
      });

      console.log('Itineries:', this.itineries);
      this.product.itinery = this.itineries;
      this.productService.addProduct(this.product).subscribe((product) => {
        this.arrProducts.push(product);
        this.resetForm();
        console.log(this.arrProducts);
      });
    } else {
      // Handle form invalid case
    }
  }

  resetForm() {
    this.itineryForm.reset();
    this.itineries = [];
  }

  generateUniqueId(items: { id: string }[]): string {
    if (items.length === 0) {
      return '1';
    }

    const maxId = Math.max(...items.map((item) => parseInt(item.id)));
    return String(maxId + 1);
  }
}
