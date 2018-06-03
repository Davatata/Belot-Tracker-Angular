import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../http-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  email: string;
  password: string;
  
  constructor(private httpService: HttpServiceService,
              private router: Router) {
    
   }

  ngOnInit() {
    this.httpService.user.subscribe(user => {
      if (user) {
        console.log(`Logged in, user data: ${this.httpService.userDetails.email.split('@')[0]}`);
        this.router.navigate(['home']);
      } else {
        console.log('Not logged in.');
      }
    });
  }

  login() {
    this.httpService.login(this.email, this.password);
    this.email = this.password = '';    
  }
}
