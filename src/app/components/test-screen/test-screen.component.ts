import { Component, OnInit } from '@angular/core';
import { Purchase, PurchaseItem } from '../../models/cart';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssessmentScoreService } from '../../services/assessment-score.service';
import { AssessmentScore } from '../../models/assessment-score';

@Component({
  selector: 'app-test-screen',
  templateUrl: './test-screen.component.html',
  styleUrl: './test-screen.component.scss',
})
export class TestScreenComponent implements OnInit {
  userId: string = '1'; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];
  userName: string = 'name';
  arrAssessment: Product[] = [];
  selectedAssessment: Product | null = null;
  itemForm: FormGroup[] = [];
  attemptedAssessments: Set<string> = new Set<string>();
  marks: number = 0;
  display: any;
  marksArray: number[] = [];
  currentAssessmentId: string = '';
  currentAssessmentMarks: number = 0;
  currentAssessmentName: string = '';

  submitted: boolean = false;
  showTimer: boolean = true;
  private chart: any;
  constructor(
    private assessmentService: DashboardService,
    private localStorageService: LocalStorageService,
    private productService: ProductService,
    private _formBuilder: FormBuilder,
    private assessmentscoreservice: AssessmentScoreService
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
    this.getUserName();
    this.loadUserAssessments();
    this.loadAttemptedAssessments();
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
    this.assessmentService.getUserAssessments(this.userId).subscribe(
      (purchases: Purchase[]) => {
        console.log('purchases: ', purchases);
        if (purchases.length > 0) {
          const purchase = purchases[0];
          console.log(purchase);
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
      console.log('Filtered Assessments: ', this.arrAssessment);
    });
  }

  attemptAssessment(assessmentId: string): void {
    console.log('Attempting assessment:', assessmentId);
    this.selectedAssessment =
      this.arrAssessment.find((product) => product.id === assessmentId) || null;
    if (this.selectedAssessment) {
      this.itemForm = this.selectedAssessment.itinery.map(() =>
        this._formBuilder.group({
          selectedOption: [''],
        })
      );
      this.attemptedAssessments.add(assessmentId);
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
}
