import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpServiceService } from './http-service.service';

import { PostItem } from './models/postItemModel.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private loading: boolean = false;
  private list: Observable<PostItem>;

  email: string;
  password: string;
  page: string;
  confirmLogOut: boolean = false;
  dropDown: boolean = false;


  constructor(private httpService: HttpServiceService) {}
  
  toggleLog() {
    this.confirmLogOut = !this.confirmLogOut;
  }

  toggleDropdown() {
    this.dropDown = !this.dropDown;
  }

  dropdownOpen() {
    return this.dropDown ? 'block' : 'none';
  }

  logout() {
    this.toggleLog(); 
    this.httpService.logout();
  }

  isLoggedIn() {
    return this.httpService.isLoggedIn();
  }

  getUser() {
    return this.httpService.user;
  }
  
}
