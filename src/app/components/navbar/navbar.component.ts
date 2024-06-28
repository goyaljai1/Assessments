import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/add-assessment.service'; // Adjust import as per your service path
import { Product } from '../../models/add-assessment'; // Adjust import as per your model path
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { CheckoutServiceService } from '../../services/checkout-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  hidden = false;
  myForm: FormGroup;
  loginForm: FormGroup;
  submitted: boolean = false;
  userArr: User[] = [];
  isLoggedIn: boolean = false;
  totalItems: number = 0;
  searchQuery: string = '';
  assessments: Product[] = []; // Assuming this will hold fetched assessments

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private productService: ProductService, // Adjust service import as per your actual service
    private localStorageService: LocalStorageService,
    private checkoutService: CheckoutServiceService,
    private router: Router
  ) {
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

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

    this.checkoutService.checkoutEvent.subscribe((cartItems) => {
      this.totalItems = cartItems.length;
    });

    this.checkLogin();
  }

  get formControl() {
    return this.myForm.controls;
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  checkLogin() {
    const role = this.localStorageService.getItem('role');
    this.isLoggedIn = role !== null;
  }

  onSubmit(frmValue: any): void {
    this.submitted = true;

    if (this.myForm.invalid) {
      return;
    }

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
            // Close the modal here
            const modal = document.getElementById('registerModal');
            if (modal) {
              (modal as any).modal('hide');
            }
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

  onSubmitLogin(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    console.log('Login Form Value:', this.loginForm.value);

    const loggedInUser = this.userArr.find(
      (user) => user.email === email && user.password === password
    );

    if (loggedInUser) {
      this.isLoggedIn = true;
      this.localStorageService.setItem('role', loggedInUser.role);
      this.localStorageService.setItem('name', loggedInUser.fName);
      this.localStorageService.setItem('userId', loggedInUser.id);
      let role = this.localStorageService.getItem('role');
      console.log(role);
      if (role === 'Admin') {
        console.log('Admin login successful!');
      } else {
        console.log('User login successful!');
      }
    } else {
      console.log('Login failed. Incorrect email or password.');
    }
  }

  onLogout(): void {
    this.localStorageService.removeItem('role');
    localStorage.clear();
    this.isLoggedIn = false;
    console.log('Logout successful!');
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  generateUniqueId(users: User[]): string {
    if (users.length === 0) {
      return '1';
    }

    const maxId = Math.max(...users.map((user) => parseInt(user.id)));
    return String(maxId + 1);
  }

  onSearch(): void {
    // Redirect to view-assessment-details page with the search query
    if (this.searchQuery.trim()) {
      this.productService.getProducts().subscribe(
        (assessments: Product[]) => {
          this.assessments = assessments;
          const foundAssessment = assessments.find(
            assessment => assessment.aName.toLowerCase() === this.searchQuery.toLowerCase()
          );
      
          if (foundAssessment) {
            this.router.navigate(['/view-assessment-details', foundAssessment.id]);
          } else {
            console.log(`Assessment '${this.searchQuery}' not found.`);
            // Handle the case where the assessment is not found (e.g., show an alert)
          }
        },
        (error: any) => {
          console.error('Error fetching assessments:', error);
        }
      );
    }
  }
}
