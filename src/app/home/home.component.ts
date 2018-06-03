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

  games: any;
  // games: Observable<any>;
  currentGame = {
    "winner": "teamDave",
    "teams": {
      "team1Name": "teamDave",
      "team2Name": "teamJack",
      "team1Score": 300,
      "team2Score": 280
    },
    "hands":[
      {
        "bet": 100,
        "bettor": "teamDave",
        "suit": "club",
        "team1Score": 100,
        "team2Score": 60,
        "betAchieved": true
      },
      {
        "bet": 120,
        "bettor": "teamDave",
        "suit": "club",
        "team1Score": 90,
        "team2Score": 70,
        "betAchieved": false
      },
      {
        "bet": 80,
        "bettor": "teamJack",
        "suit": "club",
        "team1Score": 10,
        "team2Score": 150,
        "betAchieved": true
      }
    ]
  };

  constructor(private httpService: HttpServiceService) {}

  ngOnInit() {
    
  }

  postGame() {
    let date = new Date();    
    this.currentGame["date"] = new Date();
    this.httpService.postGame(this.currentGame).subscribe(
      (res) => console.log('Posting this game: ', res),
      (error) => console.log(error)
    );    
  }

  

  

}
