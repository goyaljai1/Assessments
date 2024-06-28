import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';
import { Assessment_cards } from '../../models/assessments';
import { CartService } from '../../services/cart.service'; // Add this line
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss',
})
export class AssessmentComponent implements OnInit {
  arrProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 9;
  paginatedProducts: Product[] = [];
  constructor(private productService: ProductService,private localStorageService:LocalStorageService,private cartService: CartService,private router: Router ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.arrProducts = data;
      this.updatePaginatedProducts();
      console.log(this.arrProducts);
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
    if ((this.currentPage * this.itemsPerPage) < this.arrProducts.length) {
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
    return Array(Math.ceil(this.arrProducts.length / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
  }
  displayDetailss(aid: string) {
    console.log(aid);
    this.router.navigate(['view-assessment-details/' + parseInt(aid)]);
  }
}
