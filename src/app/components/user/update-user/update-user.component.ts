import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service'; // Import UserService

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'], // Corrected typo here
})
export class UpdateUserComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  arrUsers: User[] = [];
  idUpdated: number = 0;

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Inject UserService
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

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.arrUsers = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  get formControl() {
    return this.myForm.controls;
  }

  onSubmit(frmValue: any): void {
    console.log('Form Value:', frmValue);

    const tempUser: User = {
      id: frmValue.id,
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

    this.userService.updateUser(tempUser).subscribe(
      (response: User[]) => {
        console.log('User updated successfully', response);
      },
      (error: any) => {
        console.error('Error updating user', error);
      }
    );
  }
  onChangeType(evt: any) {
    console.log(evt.target.value);

    var idObtained = evt.target.value;
    this.idUpdated = parseInt(idObtained.split(':')[1].trim());
    console.log(this.idUpdated);

    for (var i = 0; i < this.arrUsers.length; i++) {
      if (this.idUpdated == parseInt(this.arrUsers[i].id)) {
        this.myForm.patchValue({
          id: this.arrUsers[i].id,
          firstName: this.arrUsers[i].fName,
          lastName: this.arrUsers[i].lName,
          email: this.arrUsers[i].email,
          mobile: this.arrUsers[i].mobile,
          dob: this.arrUsers[i].dob,
          role: this.arrUsers[i].role,
          password: this.arrUsers[i].password,
        });

        var addressArray = this.arrUsers[i].address;
        // var addressArrayLength = addressArray.length;
        // console.log(addressArrayLength);

        // for (var j = 0; j < addressArrayLength; j++) {
        //   if (j == 0) {
        //     this.userAddForm.patchValue({
        //       address: [
        //         {
        //           id: addressArray[j].id,
        //           houseNo: addressArray[j].houseNo,
        //           street: addressArray[j].street,
        //           area: addressArray[j].area,
        //           city: addressArray[j].city,
        //           state: addressArray[j].state,
        //           country: addressArray[j].country,
        //           pincode: addressArray[j].pincode,
        //         },
        //       ],
        //     });
        //   } else {
        //     (this.userAddForm.get('address') as FormArray).push(
        //       this.createAddress()
        //     );
        //     this.userAddForm.patchValue({
        //       address: [
        //         {
        //           id: addressArray[j].id,
        //           houseNo: addressArray[j].houseNo,
        //           street: addressArray[j].street,
        //           area: addressArray[j].area,
        //           city: addressArray[j].city,
        //           state: addressArray[j].state,
        //           country: addressArray[j].country,
        //           pincode: addressArray[j].pincode,
        //         },
        //       ],
        //     });
        //   }
        // }
      }
    }
  }
}
