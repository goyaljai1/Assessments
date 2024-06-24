import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/add-assessment';
import { CheckoutServiceService } from '../../services/checkout-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  checkoutItems: CartItem[] = [];
  totalItems: number = 0;

  constructor(private checkoutService: CheckoutServiceService) { }

  ngOnInit(): void {
    this.checkoutService.checkoutEvent.subscribe((cartItems: CartItem[]) => {
      this.checkoutItems = cartItems;
      this.totalItems = cartItems.length;
    });
  }
}
