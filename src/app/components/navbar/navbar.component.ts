import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  registerForm: FormGroup;
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
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', Validators.required],
        dob: ['', [Validators.required, this.dateOfBirthValidator]],
        role: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        address: this.fb.group({
          houseNo: ['', Validators.required],
          street: ['', Validators.required],
          area: ['', Validators.required],
          state: ['', Validators.required],
          country: ['', Validators.required],
          pincode: ['', Validators.required],
        }),
      },
      { validators: this.passwordMatchValidator }
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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
    return this.registerForm.controls;
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
    if (this.registerForm.valid) {
      console.log(frmValue);
      console.log(frmValue.value.address.area);
      this.userService.getUsers().subscribe(
        (users: User[]) => {
          const newUserId = this.generateUniqueId(users);
          const tempUser: User = {
            id: newUserId,
            fName: frmValue.value.firstName,
            lName: frmValue.value.lastName,
            email: frmValue.value.email,
            mobile: frmValue.value.mobile,
            dob: frmValue.value.dob,
            role: frmValue.value.role,
            password: frmValue.value.password,
            address: {
              houseNo: frmValue.value.address.houseNo,
              street: frmValue.value.address.street,
              area: frmValue.value.address.area,
              state: frmValue.value.address.state,
              country: frmValue.value.address.country,
              pincode: frmValue.value.address.pincode,
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
      console.log(this.registerForm.value);
    } else {
      alert('Please check the form carefully!');
      return;
    }
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
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
          alert('Admin login successful!');
        } else {
          alert('User login successful!');
        }
      } else {
        alert('Login failed. Incorrect email or password.');
      }
      console.log(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
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
            (assessment) =>
              assessment.aName.toLowerCase() === this.searchQuery.toLowerCase()
          );

          if (foundAssessment) {
            this.router.navigate([
              '/view-assessment-details',
              foundAssessment.id,
            ]);
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

  passwordMatchValidator(
    formGroup: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }

  dateOfBirthValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const dob = new Date(control.value);
    const today = new Date();
    return dob < today ? null : { invalidDob: true };
  }
}
