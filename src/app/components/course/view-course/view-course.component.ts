import { Component } from '@angular/core';
import { Course } from '../../../models/course';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrl: './view-course.component.scss'
})
export class ViewCourseComponent {
  arrCourse: Course[] = [];
  constructor(private courseservice: CourseService) {
    this.courseservice.getCourses().subscribe((data) => {
      this.arrCourse = data;
      console.log(this.arrCourse);
    });
  }
}
