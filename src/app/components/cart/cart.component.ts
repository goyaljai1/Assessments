import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Product } from '../../models/add-assessment';

interface CartItem {
  item: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  isLoggIn: boolean = false;
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  constructor(private localStorageService: LocalStorageService, private cartService: CartService) {}

  ngOnInit() {
    this.checkLogin();
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalAmount();
  }

  checkLogin() {
    const role = this.localStorageService.getItem('role');
    this.isLoggIn = role !== null;
  }

  increaseQuantity(item: Product) {
    this.cartService.increaseQuantity(item);
    this.cartItems = this.cartService.getCartItems();
  }

  decreaseQuantity(item: Product) {
    this.cartService.decreaseQuantity(item);
    this.cartItems = this.cartService.getCartItems();
  }
  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, cartItem) => {
      return total + (cartItem.item.aPrice * cartItem.quantity);
    }, 0);
  }
  checkout() {
    alert('Checkout functionality to be implemented.');
    this.cartService.clearCart();
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = 0;
  }
}
