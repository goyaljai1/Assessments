import { Address } from './address';

export class User {
  id: string;
  fName: string;
  lName: string;
  email: string;
  mobile: number;
  dob: string;
  role: string;
  password: string;
  address: Address;

  constructor(
    id: string,
    uFname: string,
    uLname: string,
    email: string,
    mobile: number,
    dob: string,
    role: string,
    password: string,
    address: Address
  ) {
    this.id = id;
    this.fName = uFname;
    this.lName = uLname;
    this.email = email;
    this.mobile = mobile;
    this.dob = dob;
    this.role = role;
    this.password = password;
    this.address = address;
  }
}
