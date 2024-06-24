import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../models/course';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrl: './add-course.component.scss',
})
export class AddCourseComponent implements OnInit {
  addCourseForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.addCourseForm = this.fb.group({
      courseId: ['', Validators.required],
      categoryId: ['', Validators.required],
      courseName: [''],
      courseDescription: [''],
    });
  }

  ngOnInit(): void {}

  get formControl() {
    return this.addCourseForm.controls;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    this.courseService.getCourses().subscribe(
      () => {
        const tempCourse: Course = {
          id: frmValue.courseId,
          categoryId: frmValue.categoryId,
          cName: frmValue.courseName,
          cDescription: frmValue.courseDescription,
        };

        this.courseService.addCourse(tempCourse).subscribe(
          (response: any) => {
            console.log('Course added successfully', response);
          },
          (error: any) => {
            console.error('Error adding Course', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching Courses', error);
      }
    );
  }
}
