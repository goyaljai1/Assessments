import { Injectable } from '@angular/core';
import { Activity, Itinery, Product } from '../models/add-assessment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  arrProducts: Product[] = [];

  constructor() {
    this.arrProducts = [
      new Product(0, 'Maths', 20, '60 mins', 101, [
        new Itinery(1, 'mcq', 'What is 2+2?', {
          optionA: '1',
          optionB: '2',
          optionC: '3',
          optionD: '4',
        }),
        new Itinery(2, 'truefalse', '2+2 = 3?', {
          optionTrue: 'True',
          optionFalse: 'False',
        }),
      ]),
      new Product(1, 'Social Science', 30, '40 mins', 102, [
        new Itinery(1, 'mcq', 'What is the capital of England?', {
          optionA: 'London',
          optionB: 'Bristol',
          optionC: 'Manchester',
          optionD: 'Liverpool',
        }),
        new Itinery(2, 'truefalse', 'Manchester is the capital of England.', {
          optionTrue: 'True',
          optionFalse: 'False',
        }),
      ]),
    ];
  }

  getProducts() {
    return this.arrProducts;
  }

  addProduct(p: Product) {
    this.arrProducts.push(p);
    console.log(this.arrProducts);
  }
}
