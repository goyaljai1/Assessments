import { Injectable, EventEmitter } from '@angular/core';
import { CartItem } from '../models/add-assessment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
  checkoutEvent = new EventEmitter<CartItem[]>();

  constructor() { }

  emitCheckoutEvent(cartItems: CartItem[]) {
    this.checkoutEvent.emit(cartItems);
  }
}
