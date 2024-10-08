import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PurchaseItem } from '../../../models/cart';
import { AssessmentScore } from '../../../models/assessment-score';
import { LocalStorageService } from '../../../services/local-storage-service.service';
import { AssessmentScoreService } from '../../../services/assessment-score.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {
  userId: any; // Replace with actual logic to get current logged-in user ID
  assessments: PurchaseItem[] = [];
  userName: string = 'name';
  arrAssessmentScore: AssessmentScore[] = [];
  chartOptions = {};
  selectedAssessment: AssessmentScore[] = [];

  submitted: boolean = false;
  ngOnInit(): void {
    this.getUserName();
    this.userId = this.localStorageService.getItem('userId');
  }
  constructor(
    private localStorageService: LocalStorageService,
    private assessmentscoreservice: AssessmentScoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.assessmentscoreservice.getAssessmentScores().subscribe((data) => {
      this.arrAssessmentScore = data;
      console.log(this.arrAssessmentScore);
    });
  }
  private getUserName(): void {
    const name = this.localStorageService.getItem('name');
    if (name) {
      this.userName = name;
    } else {
      this.userName = '';
    }
  }

  seeResults(aId: any): void {
    this.submitted = true; // Reset submitted to false before updating
    const selectedAssessment = this.arrAssessmentScore.find(
      (assessment) => assessment.id === aId
    );

    if (selectedAssessment && selectedAssessment.marksArray) {
      const marksArray = selectedAssessment.marksArray;
      const dataPoints = marksArray.map((marks, index) => ({
        label: `Q ${index + 1}`,
        y: marks,
        indexLabel: String(marks),
      }));

      console.log(marksArray);
      this.chartOptions = {};
      setTimeout(() => {
        this.chartOptions = {
          title: {
            text: 'Marks Distribution',
          },
          subtitles: [
            {
              text: `Assessment: ${selectedAssessment.assessmentName}`,
            },
            {
              text: `Total Marks: ${selectedAssessment.totalMarks}, Score: ${selectedAssessment.score}`,
            },
          ],
          animationEnabled: true,
          axisX: {
            title: 'Question Number', // Name for the X-axis
          },
          axisY: {
            title: 'Marks Obtained', // Name for the Y-axis
            includeZero: true,
          },
          data: [
            {
              type: 'column',
              indexLabelFontColor: '#5A5757',
              indexLabelPlacement: 'outside',
              dataPoints: dataPoints,
            },
          ],
        };
      }, 0);
      this.cdr.detectChanges();
    } else {
      console.error(`Assessment with id ${aId} not found or has no marksArray`);
    }
  }

  generateReport() {
    const data = document.getElementById('pdfContent');
    if (data) {
      html2canvas(data).then((canvas) => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('assessment-report.pdf');
      });
    }
  }

  seeAssessments() {
    console.log('Hello');
  }
}
