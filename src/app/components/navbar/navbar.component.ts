import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { LocalStorageService } from '../../services/local-storage-service.service';
import {CartComponent} from '../cart/cart.component';
import { checkLogin } from '../../helper/helper';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  myForm: FormGroup;
  userArr: User[] = [];
  isLoggedIn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {
    this.myForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.userArr = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

  }


  onSubmit(): void {
    const email = this.myForm.value.email;
    const password = this.myForm.value.password;
    console.log('email: ', email);
    console.log(this.userArr);
    const loggedInUser = this.userArr.find(
      (user) => user.email === email && user.password === password
    );

    if (loggedInUser) {
      this.isLoggedIn = true;
    
      this.localStorageService.setItem('role', loggedInUser.role);
      let role = this.localStorageService.getItem('role');
      console.log(role);
      if (role === 'Admin') {
        console.log('Admin login successful!');
      } else {
        console.log('User login successful!');
      }  
    //   if (this.isLoggedIn) {
    //     location.reload();
    // }
    } else {
      console.log('Login failed. Incorrect email or password.');

    }
  }
  onLogout(): void {
    this.localStorageService.removeItem('role');
    this.isLoggedIn = false;
    console.log('Logout successful!');
  }
}
