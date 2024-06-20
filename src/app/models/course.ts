export class Course {
  id: number;
  cName: string;
  cDescription: string;
  categoryId: number;

  constructor(id: number, cName: string, cDescription: string, categoryId: number) {
    this.id = id;
    this.cName = cName;
    this.cDescription = cDescription;
    this.categoryId = categoryId;
  }
}
