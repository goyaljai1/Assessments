import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss',
})
export class ViewUserComponent {
  arrUser: User[] = [];
  constructor(private userservice: UserService) {
    this.userservice.getUsers().subscribe((data) => {
      this.arrUser = data;
      console.log(this.arrUser);
    });
  }
}
