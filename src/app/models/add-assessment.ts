export class Product {
  id: number;
  aName: string;
  marks: number;
  time: string;
  course_id: number;
  itinery: Itinery[] = [];

  constructor(
    id: number,
    aName: string,
    marks: number,
    time: string,
    course_id: number,
    itin: Itinery[]
  ) {
    this.id = id;
    this.aName = aName;
    this.marks = marks;
    this.time = time;
    this.course_id = course_id;
    this.itinery = itin;
  }
}

export class Itinery {
  id: number;
  category: string;
  question: string;
  options: any;

  constructor(id: number, category: string, question: string, options: any) {
    this.id = id;
    this.category = category;
    this.question = question;
    this.options = options;
  }
}

export class Activity {
  id: number;
  actName: string;

  constructor(id: number, actNm: string) {
    this.id = id;
    this.actName = actNm;
  }
}
