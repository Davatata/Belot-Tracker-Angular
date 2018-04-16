import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  email: string;
  password: string;
  
  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
  }

  login() {
    this.httpService.login(this.email, this.password);
    this.email = this.password = '';    
  }
}
