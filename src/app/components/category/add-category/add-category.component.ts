import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit{
  addCategoryForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.addCategoryForm = this.fb.group({
      categoryId: ['', Validators.required],
      categoryDescription: ['',Validators.required],
    });
  }

  ngOnInit(): void {}

  get formControl() {
    return this.addCategoryForm.controls;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    this.categoryService.getCategory().subscribe(
      () => {
        const tempCategory: Category = {
          id: frmValue.categoryId,
          catDescription: frmValue.categoryDescription,
        };

        this.categoryService.addCategory(tempCategory).subscribe(
          (response: any) => {
            console.log('Category added successfully', response);
          },
          (error: any) => {
            console.error('Error adding Category', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching Category', error);
      }
    );
  }
}
