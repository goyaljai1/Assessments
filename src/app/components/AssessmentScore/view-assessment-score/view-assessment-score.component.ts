import { Component, OnInit } from '@angular/core';
import { AssessmentScoreService } from '../../../services/assessment-score.service';
import { UserService } from '../../../services/user.service';
import { AssessmentScore } from '../../../models/assessment-score';
import { User } from '../../../models/user';

@Component({
  selector: 'app-view-assessment-score',
  templateUrl: './view-assessment-score.component.html',
  styleUrls: ['./view-assessment-score.component.scss']
})
export class ViewAssessmentScoreComponent implements OnInit {
  assessmentScores: any[] = []; // Change the type to 'any' to include user names
  users: User[] = [];

  constructor(
    private assessmentScoreService: AssessmentScoreService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.loadAssessmentScores();
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  loadAssessmentScores(): void {
    this.assessmentScoreService.getAssessmentScores().subscribe(
      (scores) => {
        this.assessmentScores = scores.map(score => {
          const user = this.users.find(u => u.id === score.userId);
          return {
            ...score,
            userName: user ? `${user.fName} ${user.lName}` : 'Unknown User'
          };
        });
      },
      (error) => {
        console.error('Error fetching assessment scores', error);
      }
    );
  }
}
