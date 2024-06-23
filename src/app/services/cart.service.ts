import { Injectable } from '@angular/core';
import { Assessment_cards } from '../models/assessments';
// import { CartItem } from '../models/cart';
import { LocalStorageService } from '../services/local-storage-service.service';

interface CartItem {
  item: Assessment_cards;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private storageKey = 'userCart';

  constructor(private localStorageService: LocalStorageService) {
    this.loadCart();
  }

  private loadCart() {
    const storedCart = this.localStorageService.getItem(this.storageKey);
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
    }
  }

  private saveCart() {
    this.localStorageService.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  addToCart(item: Assessment_cards) {
    const existingItem = this.cartItems.find(cartItem => cartItem.item.cardTitle === item.cardTitle);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ item, quantity: 1 });
    }
    this.saveCart();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  increaseQuantity(item: Assessment_cards) {
    const cartItem = this.cartItems.find(cartItem => cartItem.item.cardTitle === item.cardTitle);
    if (cartItem) {
      cartItem.quantity++;
    }
    this.saveCart();
  }

  decreaseQuantity(item: Assessment_cards) {
    const cartItem = this.cartItems.find(cartItem => cartItem.item.cardTitle === item.cardTitle);
    if (cartItem) {
      cartItem.quantity--;
      if (cartItem.quantity === 0) {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.item.cardTitle !== item.cardTitle);
      }
    }
    this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }
}