import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from '../http-service.service';
import { Observable } from '@firebase/util';
import { AngularFireList } from 'angularfire2/database';

import { Game } from "./../models/game.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private httpService: HttpServiceService) {}

  ngOnInit() {}

  getUser() {
    return this.httpService.user;
  }

}
