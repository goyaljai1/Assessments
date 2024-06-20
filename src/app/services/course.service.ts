import { Injectable } from '@angular/core';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  arrCourse: Course[] = [];

  constructor() {
    this, (this.arrCourse = [new Course(1, 'Angular', 'Detailed Course on Angular',3)]);
  }
  onSubmit(frmValue: any): void {
    console.log('you submitted value: ', frmValue);
  }
}
