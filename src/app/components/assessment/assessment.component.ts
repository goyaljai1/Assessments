import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Router } from '@angular/router';
import PptxGenJS from 'pptxgenjs';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
})
export class AssessmentComponent implements OnInit {
  arrProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.arrProducts = data;
      this.updatePaginatedProducts();
    });
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.arrProducts.slice(startIndex, endIndex);
  }

  displayDetails(cardTitle: string, cardSTitle: string) {
    alert(`Card Title: ${cardTitle}. Card Sub-Title: ${cardSTitle}`);
  }

  displayCartDetails(product: Product) {
    const role = this.localStorageService.getItem('role');
    if (role === null) {
      alert('Please login to add items to the cart.');
      return;
    }
    this.cartService.addToCart(product);
    alert(`Assessment ${product.aName} added to cart successfully!`);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.arrProducts.length) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  getTotalPages(): number[] {
    return Array(Math.ceil(this.arrProducts.length / this.itemsPerPage))
      .fill(0)
      .map((x, i) => i + 1);
  }

  displayDetailss(aid: string) {
    this.router.navigate(['view-assessment-details/' + parseInt(aid)]);
  }

  async generatePowerPoint() {
    let pptx = new PptxGenJS();

    // Slide 1: Company Name
    let slide1 = pptx.addSlide();
    slide1.addText('Signdesk', {
      x: 1, y: 1, fontSize: 24, bold: true, color: '003366', // Dark blue color
      align: 'center',
      fontFace: 'Arial'
    });

    // Slide 2: Assessment Names
    let slide2 = pptx.addSlide();
    let assessmentNames = this.arrProducts.map(product => product.aName).join(', ');
    slide2.addText('Assessments', {
      x: 0.5,
      y: 0.5,
      fontSize: 24,
      bold: true,
      color: '000000', // Black color
      fontFace: 'Arial'
    });
    slide2.addText(assessmentNames, {
      x: 2,
      y: 3,
      fontSize: 18,
      color: '666666', // Gray color
      fontFace: 'Arial'
    });

    // Slide 3: Assessment Details (Using the first assessment for demo)
    let slide3 = pptx.addSlide();
    let firstAssessment = this.arrProducts[0];
    slide3.addText(`Assessment Name: ${firstAssessment.aName}`, {
      x: 0.5,
      y: 0.5,
      fontSize: 24,
      bold: true,
      color: '003366', // Dark blue color
      fontFace: 'Arial'
    });
    slide3.addText(`Description: ${firstAssessment.aDes}`, {
      x: 0.5,
      y: 1,
      fontSize: 18,
      color: '333333', // Dark gray color
      fontFace: 'Arial'
    });
    slide3.addText(`Price: ${firstAssessment.aPrice}`, {
      x: 0.5,
      y: 1.5,
      fontSize: 18,
      color: '333333', // Dark gray color
      fontFace: 'Arial'
    });
    // Add the assessment image
    const imgResponse = await fetch(firstAssessment.aImgSrc);
    const imgBlob = await imgResponse.blob();
    const reader = new FileReader();
    reader.readAsDataURL(imgBlob);

    reader.onloadend = function () {
      const base64data: string | undefined = reader.result as string | undefined;
      slide3.addImage({ data: base64data, x: 6.5, y: 2, w: 3, h: 3, rounding: true });
      pptx.writeFile({ fileName: 'Assessments.pptx' });
    };
  }
}