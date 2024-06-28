import { Component, OnInit } from '@angular/core';
import { Purchase, PurchaseItem } from '../../models/cart';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssessmentScoreService } from '../../services/assessment-score.service';
import { AssessmentScore } from '../../models/assessment-score';
import { AttendanceService } from '../../services/attendance.service';
import { Attendance } from '../../models/attendance';

@Component({
  selector: 'app-test-screen',
  templateUrl: './test-screen.component.html',
  styleUrl: './test-screen.component.scss',
})
export class TestScreenComponent implements OnInit {
  userId: any; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];
  userName: string = 'name';
  arrAssessment: Product[] = [];
  selectedAssessment: Product | null = null;
  itemForm: FormGroup[] = [];
  transformedAssessments: {
    instanceId: string;
    attemptNumber: number;
    assessment: Product;
  }[] = [];

  attemptedAssessments: Set<string> = new Set<string>();
  marks: number = 0;
  display: any;
  marksArray: number[] = [];
  currentAssessmentId: string = '';
  currentAssessmentMarks: number = 0;
  currentAssessmentName: string = '';
  allPurchases: any;
  arrAttendance: Attendance[] = [];
  submitted: boolean = false;
  showTimer: boolean = true;
  private chart: any;
  constructor(
    private assessmentService: DashboardService,
    private localStorageService: LocalStorageService,
    private productService: ProductService,
    private _formBuilder: FormBuilder,
    private assessmentscoreservice: AssessmentScoreService,
    private attendanceservice: AttendanceService
  ) {}

  private getUserName(): void {
    const name = this.localStorageService.getItem('name');
    if (name) {
      this.userName = name;
    } else {
      this.userName = '';
    }
  }

  ngOnInit(): void {
    this.userId = this.localStorageService.getItem('userId');
    this.getUserName();
    this.loadUserAssessments();
    this.loadAttemptedAssessments();

    // this.filterAssessments();
    // console.log('hi');
  }
  loadAttemptedAssessments(): void {
    const attempted = this.localStorageService.getItem('attemptedAssessments');
    if (attempted) {
      this.attemptedAssessments = new Set<string>(JSON.parse(attempted));
    }
  }
  saveAttemptedAssessments(): void {
    this.localStorageService.setItem(
      'attemptedAssessments',
      JSON.stringify([...this.attemptedAssessments])
    );
  }
  seeAssessments() {
    console.log('Hello');
  }

  loadUserAssessments(): void {
    console.log(
      this.assessmentService.getUserAssessments(this.userId).subscribe()
    );
    this.assessmentService.getUserAssessments(this.userId).subscribe(
      (purchases: Purchase[]) => {
        console.log(purchases);
        if (purchases.length > 0) {
          const purchase = purchases[0];

          if (purchase && purchase.items) {
            this.assessments = purchase.items;
            this.filterAssessments();
          }
        }
      },
      (error) => {
        console.error('Error fetching assessments:', error);
      }
    );
  }

  filterAssessments(): void {
    this.productService.getProducts().subscribe((data) => {
      this.arrAssessment = data.filter((product) =>
        this.assessments.some((a) => a.assessmentId === product.id)
      );
      this.transformAssessments();
    });
  }

  transformAssessments(): void {
    this.transformedAssessments = [];
    for (const item of this.assessments) {
      const assessment = this.arrAssessment.find(
        (a) => a.id === item.assessmentId
      );
      if (assessment) {
        for (let i = 1; i <= item.quantity; i++) {
          const instanceId = `${assessment.id}-${i}`; // Unique instance ID
          this.transformedAssessments.push({
            instanceId,
            assessment: { ...assessment },
            attemptNumber: i, // Assigning attempt number
          });
        }
      }
    }
  }

  attemptAssessment(instanceId: string): void {
    console.log('Attempting assessment:', instanceId);
    const selectedInstance = this.transformedAssessments.find(
      (instance) => instance.instanceId === instanceId
    );
    if (selectedInstance) {
      this.selectedAssessment = selectedInstance.assessment;
      this.itemForm = this.selectedAssessment.itinery.map(() =>
        this._formBuilder.group({
          selectedOption: [''],
        })
      );
      this.attemptedAssessments.add(instanceId);
      this.saveAttemptedAssessments();
    }
  }

  goBack(): void {
    this.selectedAssessment = null;
    this.itemForm = [];
  }

  submitAssessment(): void {
    this.showTimer = false;
    let qNo = 0;
    if (this.selectedAssessment) {
      const selectedOptions = this.itemForm.map((formGroup, index) => {
        const selectedOption = formGroup.get('selectedOption')?.value;
        return {
          question: this.selectedAssessment!.itinery[index].question,
          selectedOption: selectedOption,
        };
      });
      const marksPerQuestion = Math.floor(
        this.selectedAssessment.marks / this.selectedAssessment.itinery.length
      );
      for (qNo; qNo < selectedOptions.length; qNo++) {
        if (
          selectedOptions[qNo].selectedOption ===
          this.selectedAssessment.itinery[qNo].correctAns
        ) {
          this.marks = this.marks + marksPerQuestion;
          this.marksArray.push(
            Math.floor(
              this.selectedAssessment.marks /
                this.selectedAssessment.itinery.length
            )
          );
        } else {
          this.marksArray.push(0);
        }
      }
      // this.submitted = true;
      this.currentAssessmentMarks = this.selectedAssessment.marks;
      this.currentAssessmentName = this.selectedAssessment.aName;
      this.currentAssessmentId = this.selectedAssessment.id;
      this.updateAssessmentScore();
      this.goBack();
      this.attendanceservice.getAttendances().subscribe(
        (assessmentScores: Attendance[]) => {
          const newAttendanceId =
            this.generateUniqueIdAttendance(assessmentScores);
          const tempAttendance: Attendance = {
            id: newAttendanceId,
            assessmentName: this.currentAssessmentName,
            date: new Date().toISOString(),
            assessmentId: this.currentAssessmentId,
            userId: this.userId,
            attemptId: `${this.transformedAssessments[0].instanceId}`,
            status: 'Attempted',
          };
          this.attendanceservice.addAttendance(tempAttendance).subscribe(
            (response: any) => {
              console.log('Attendance added successfully', response);
            },
            (error: any) => {
              console.error('Error adding Attendance', error);
            }
          );
        },
        (error: any) => {
          console.error('Error fetching Assessment Scores', error);
        }
      );
    }
  }

  seeResults() {
    this.submitted = true;
  }
  updateAssessmentScore() {
    this.assessmentscoreservice.getAssessmentScores().subscribe(
      (assessments: AssessmentScore[]) => {
        const newUserId = this.generateUniqueId(assessments);
        console.log(this.selectedAssessment);
        const tempAssessmentScore: AssessmentScore = {
          id: newUserId,
          assessmentId: this.currentAssessmentId,
          userId: this.userId,
          score: this.marks,
          totalMarks: this.currentAssessmentMarks,
          assessmentName: this.currentAssessmentName,
          marksArray: this.marksArray,
        };

        this.assessmentscoreservice
          .addAssessmentScore(tempAssessmentScore)
          .subscribe(
            (response: any) => {
              console.log('Assessment Score added successfully', response);
            },
            (error: any) => {
              console.error('Error adding user', error);
            }
          );
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  isAttempted(assessmentId: string): boolean {
    return this.attemptedAssessments.has(assessmentId);
  }

  timer(minutes: number) {
    let seconds: number = minutes * 60;
    let textSec: string;
    let statSec: number = 60;

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else {
        textSec = statSec.toString();
      }

      const displayMinutes = Math.floor(seconds / 60);
      const prefix = displayMinutes < 10 ? '0' : '';
      this.display = `${prefix}${displayMinutes}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(timer);
      }
    }, 1000);
  }
  generateUniqueId(assessmentscore: AssessmentScore[]): string {
    if (assessmentscore.length === 0) {
      return '1';
    }

    const maxId = Math.max(
      ...assessmentscore.map((assessment) => parseInt(assessment.id))
    );
    return String(maxId + 1);
  }
  generateUniqueIdAttendance(assessmentscore: Attendance[]): string {
    if (assessmentscore.length === 0) {
      return '1';
    }

    const maxId = Math.max(
      ...assessmentscore.map((assessment) => parseInt(assessment.id))
    );
    return String(maxId + 1);
  }
}
