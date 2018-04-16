import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  email: string;
  password: string;

  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
  }

  signup() {
    this.httpService.signup(this.email, this.password);
    this.email = this.password = '';
  }

}
