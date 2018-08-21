import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
  }

  getCheckingUserInfo() {
    return this.httpService.checkingUserInfo;
  }

}
