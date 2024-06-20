import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.myForm = this.fb.group({
      id: [0, Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      email: [''],
      mobile: [''],
      dob: [''],
      role: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        houseNo: [''],
        street: [''],
        area: [''],
        state: [''],
        country: [''],
        pincode: [''],
      }),
    });
  }

  ngOnInit(): void {}

  get formControl() {
    return this.myForm.controls;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    this.userService.getUsers().subscribe(
      (users: User[]) => {
        const newUserId = this.generateUniqueId(users);
        const tempUser: User = {
          id: newUserId,
          fName: frmValue.firstName,
          lName: frmValue.lastName,
          email: frmValue.email,
          mobile: frmValue.mobile,
          dob: frmValue.dob,
          role: frmValue.role,
          password: frmValue.password,
          address: {
            houseNo: frmValue.address.houseNo,
            street: frmValue.address.street,
            area: frmValue.address.area,
            state: frmValue.address.state,
            country: frmValue.address.country,
            pincode: frmValue.address.pincode,
          },
        };

        this.userService.addUser(tempUser).subscribe(
          (response: any) => {
            console.log('User added successfully', response);
          },
          (error: any) => {
            console.error('Error adding user', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  generateUniqueId(users: User[]): string {
    if (users.length === 0) {
      return '1';
    }

    const maxId = Math.max(...users.map((user) => parseInt(user.id)));
    return String(maxId + 1);
  }
}
