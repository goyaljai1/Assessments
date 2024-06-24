import { Injectable } from '@angular/core';
import { Product, CartItem } from '../models/add-assessment';
import { LocalStorageService } from './local-storage-service.service';

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

  addToCart(item: Product) {
    const existingItem = this.cartItems.find(cartItem => cartItem.item.aName === item.aName);
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

  increaseQuantity(item: Product) {
    const cartItem = this.cartItems.find(cartItem => cartItem.item.aName === item.aName);
    if (cartItem) {
      cartItem.quantity++;
    }
    this.saveCart();
  }

  decreaseQuantity(item: Product) {
    const cartItem = this.cartItems.find(cartItem => cartItem.item.aName === item.aName);
    if (cartItem) {
      cartItem.quantity--;
      if (cartItem.quantity === 0) {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.item.aName !== item.aName);
      }
    }
    this.saveCart();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }
}
