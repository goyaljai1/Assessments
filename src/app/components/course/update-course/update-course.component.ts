import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../models/course';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.scss',
})
export class UpdateCourseComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  arrCourses: Course[] = [];
  idUpdated: number = 0;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    // Inject UserService
    this.myForm = this.fb.group({
      id: [0, Validators.required],
      courseName: ['', Validators.required],
      categoryId: [''],
      courseDescription: [''],
    });
  }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe(
      (courses: Course[]) => {
        this.arrCourses = courses;
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

    const tempCourse: Course = {
      id: frmValue.id,
      cName: frmValue.courseName,
      categoryId: frmValue.categoryId,
      cDescription: frmValue.courseDescription,
    };

    this.courseService.updateCourse(tempCourse).subscribe(
      (response: Course[]) => {
        console.log('Course updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating course', error);
      }
    );
  }
  onChangeType(evt: any) {
    console.log(evt.target.value);

    var idObtained = evt.target.value;
    this.idUpdated = parseInt(idObtained.split(':')[1].trim());
    console.log(this.idUpdated);

    for (var i = 0; i < this.arrCourses.length; i++) {
      if (this.idUpdated == parseInt(this.arrCourses[i].id)) {
        this.myForm.patchValue({
          id: this.arrCourses[i].id,
          courseName: this.arrCourses[i].cName,
          categoryId: this.arrCourses[i].categoryId,
          courseDescription: this.arrCourses[i].cDescription,
        });
      }
    }
  }
}
