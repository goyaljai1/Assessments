import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
})
export class AddCourseComponent {
  addCourseForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder) {
    this.addCourseForm = this.fb.group({
      courseId: ['', Validators.required],
      courseName: [''],
      courseDescription: [''],
      categoryId: [''],
    });
  }

  get formControl() {
    return this.addCourseForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addCourseForm.valid) {
      console.log('Form submitted:', this.addCourseForm.value);
    } else {
      console.log('Form is in-valid');
    }
  }
}
