import { Component } from '@angular/core';
import { Attendance } from '../../../models/attendance';
import { AttendanceService } from '../../../services/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  arrAttendance: Attendance[] = [];
  constructor(private courseservice: AttendanceService) {
    this.courseservice.getAttendances().subscribe((data) => {
      this.arrAttendance = data;
      console.log(this.arrAttendance);
    });
  }
}
