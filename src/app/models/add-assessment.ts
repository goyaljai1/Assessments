export class Product {
  id: string;
  aName: string;
  aDes: string;
  aImgSrc: string;
  aPrice: number;
  marks: number;
  time: string;
  course_id: string;
  itinery: Itinery[] = [];

  constructor(
    id: string,
    aName: string,
    aDes: string,
    aImgSrc: string,
    aPrice: number,
    marks: number,
    time: string,
    course_id: string,
    itin: Itinery[]
  ) {
    this.id = id;
    this.aName = aName;
    this.aDes = aDes;
    this.aImgSrc = aImgSrc;
    this.aPrice = aPrice;
    this.marks = marks;
    this.time = time;
    this.course_id = course_id;
    this.itinery = itin;
  }
}

export class Itinery {
  id: string;
  category: string;
  question: string;
  options: any;
  correctAns: string;

  constructor(
    id: string,
    category: string,
    question: string,
    options: any,
    correctAns: string
  ) {
    this.id = id;
    this.category = category;
    this.question = question;
    this.options = options;
    this.correctAns = correctAns;
  }
}

export interface CartItem {
  item: Product;
  quantity: number;
}
// export class Activity {
//   id: number;
//   actName: string;

//   constructor(id: number, actNm: string) {
//     this.id = id;
//     this.actName = actNm;
//   }
// }
