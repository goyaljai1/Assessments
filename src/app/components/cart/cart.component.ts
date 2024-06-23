import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Assessment_cards } from '../../models/assessments';
import { CartItem } from '../../models/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  isLoggIn: boolean = false;
  cartItems: CartItem[] = [];

  constructor(private localStorageService: LocalStorageService, private cartService: CartService) {}

  ngOnInit() {
    this.checkLogin();
    this.loadCartItems();
  }

  checkLogin() {
    let role = this.localStorageService.getItem('role');
    this.isLoggIn = role !== null;
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
  }

  increaseQuantity(item: Assessment_cards) {
    this.cartService.increaseQuantity(item);
    this.loadCartItems();
  }

  decreaseQuantity(item: Assessment_cards) {
    this.cartService.decreaseQuantity(item);
    this.loadCartItems();
  }

  checkout() {
    alert('Checkout functionality to be implemented.');
    // Implement checkout logic here
  }
}
