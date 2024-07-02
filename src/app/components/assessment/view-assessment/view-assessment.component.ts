import { Component } from '@angular/core';
import { Product } from '../../../models/add-assessment';
import { ProductService } from '../../../services/add-assessment.service';
import {
  Document,
  Packer,
  Paragraph,
  Tab,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { LocalStorageService } from '../../../services/local-storage-service.service';

@Component({
  selector: 'app-view-assessment',
  templateUrl: './view-assessment.component.html',
  styleUrl: './view-assessment.component.scss',
})
export class ViewAssessmentComponent {
  arrCourse: Product[] = [];
  userRole: any;
  userId: any;
  constructor(
    private productservice: ProductService,
    private localStorage: LocalStorageService
  ) {
    this.productservice.getProducts().subscribe((data) => {
      this.arrCourse = data;
      console.log(this.arrCourse);
      this.userRole = this.localStorage.getItem('role');
      this.userId = this.localStorage.getItem('userId');
      console.log(this.userRole);
    });
  }

  generateDocx() {
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Course ID')] }),
          new TableCell({ children: [new Paragraph('Course Name')] }),
          new TableCell({ children: [new Paragraph('Price')] }),
          new TableCell({ children: [new Paragraph('Course Description')] }),
        ],
      }),
    ];

    for (let course of this.arrCourse) {
      const row = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(course.id.toString())] }),
          new TableCell({ children: [new Paragraph(course.aName)] }),
          new TableCell({
            children: [new Paragraph(course.aPrice.toString())],
          }),
          new TableCell({ children: [new Paragraph(course.aDes)] }),
        ],
      });
      tableRows.push(row);
    }

    const table = new Table({
      style: 'MyCustomTableStyle',
      width: {
        size: 9070,
        type: WidthType.DXA,
      },
      rows: tableRows,
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun('Detailed Report on Available Assessments'),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: 'This report contains detailed information about the available assessments including their course ID, name, price, and description.',
                  break: 1,
                }),
              ],
            }),
            table,
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Note: The prices listed are subject to change and are current as of the date of this report.',
                  break: 1,
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'CourseTable.docx');
    });
  }
}
