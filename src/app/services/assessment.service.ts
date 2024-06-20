import { Injectable } from '@angular/core';
import { Assessment } from '../models/assessment';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  arrAssesments: Assessment[] = [];

  constructor() {
    this.arrAssesments = [
      new Assessment(
        0,
        '/assets/images/RoR.png',
        'Ruby on Rails',
        'Test your skills in Ruby on Rails with our comprehensive assessment. This test covers key concepts including MVC architecture, RESTful routes, Active Record, and more. Check your skills now!',
        'true'
      ),
      new Assessment(
        1,
        '/assets/images/angular.png',
        'Angular',
        'Test your skills in Angular with our comprehensive assessment. This test covers key concepts including MVC architecture, RESTful routes, Active Record, and more. Check your skills now!',
        'true'
      ),
      new Assessment(
        2,
        '/assets/images/node.jpg.png',
        'Node.Js',
        'Test your skills in Node.Js with our comprehensive assessment. This test covers key concepts including MVC architecture, RESTful routes, Active Record, and more. Check your skills now!',
        'true'
      ),
    ];
  }

  getAssessments() {
    return this.arrAssesments;
  }

  getAssessmentById(id: number) {
    for (var i = 0; i < this.arrAssesments.length; i++) {
      if (id == this.arrAssesments[i].id) {
        return this.arrAssesments[i];
      }
    }
    return new Assessment(0, '', '', '', '');
  }
  onSubmit(frmValue: any): void {
    console.log('you submitted value: ', frmValue);
  }
}
