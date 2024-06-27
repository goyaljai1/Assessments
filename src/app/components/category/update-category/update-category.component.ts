import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss',
})
export class UpdateCategoryComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  arrCategory: Category[] = [];
  idUpdated: number = 0;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    // Inject UserService
    this.myForm = this.fb.group({
      id: [0, Validators.required],
      categoryDescription: [''],
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe(
      (category: Category[]) => {
        this.arrCategory = category;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  get formControl() {
    return this.myForm.controls;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const tempCourse: Category = {
      id: frmValue.id,
      catDescription: frmValue.categoryDescription,
    };

    this.categoryService.updateCategory(tempCourse).subscribe(
      (response: Category[]) => {
        console.log('Category updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating Category', error);
      }
    );
  }
  onChangeType(evt: any) {
    console.log(evt.target.value);

    var idObtained = evt.target.value;
    this.idUpdated = parseInt(idObtained.split(':')[1].trim());
    console.log(this.idUpdated);

    for (var i = 0; i < this.arrCategory.length; i++) {
      if (this.idUpdated == (this.arrCategory[i].id)) {
        this.myForm.patchValue({
          id: this.arrCategory[i].id,
          categoryDescription: this.arrCategory[i].catDescription,
        });
      }
    }
  }
}
