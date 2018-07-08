import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  email: string;
  password: string;

  constructor(private httpService: HttpServiceService,
              private router: Router) { }

  ngOnInit() {
    this.httpService.user.subscribe(user => {
      if (user) {
        console.log(`Logged in, user data: ${this.httpService.userDetails.email.split('@')[0]}`);
        this.router.navigate(['history']);
      } else {
        console.log('Not logged in.');
      }
    });
  }

  signup() {
    this.httpService.signup(this.email, this.password);
    this.email = this.password = '';
  }

}
