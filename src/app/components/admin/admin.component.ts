import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  arrUser: User[] = [];
  userRole: string = '';

  constructor(private userservice: UserService, private localStorageService: LocalStorageService) {
    console.log( "User role is ", this.localStorageService.getItem('role'));
    this.userRole = this.localStorageService.getItem('role')!;
   };

}

