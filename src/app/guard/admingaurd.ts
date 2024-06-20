import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage-service.service';
@Injectable({
  providedIn: 'root',
})
export class AdminGaurd implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let role = this.localStorageService.getItem('role');

<<<<<<< HEAD
    if (role === 'Admin') {
=======
    if (role === 'admin') {
>>>>>>> 1d5db161c2b943821481ee236353a2d4e8fbd0e3
      return true;
    }
    console.log('Sorry, no access for role ' + role);
    this.router.navigate(['/home']);
    return false;
  }
}
