import { Component, OnInit, Input } from '@angular/core';
import { Observable } from "rxjs/Rx";

import { HttpServiceService } from "../../http-service.service";
import { Hand } from "../../models/hand.model";
import { Game } from "../../models/game.model";
import { HttpHandler } from '@angular/common/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  
  @Input() team1: string = 'A team';
  @Input() team2: string = 'B team';
  games: any;
  editMode = false;
  observable: Observable<number>;
  selectedTab = 0;
  currentGame: Game = null;
  currentHand: Hand = null;
  // @Input() formHand: Hand = {
  //   handId: 0,
  //   bet: 100,
  //   bettor: "A team",
  //   suit: "Heart",
  //   team1Score: 90,
  //   team2Score: 70,
  //   betAchieved: false
  // };
  @Input() formHand: Hand;
  hands: Hand[] = [
    {
      handId: 1,
      bet: 100,
      bettor: "Team1",
      suit: "Heart",
      team1Score: 90,
      team2Score: 70,
      betAchieved: false
    },
    {
      handId: 2,
      bet: 100,
      bettor: "Team2",
      suit: "Club",
      team1Score: 120,
      team2Score: 50,
      betAchieved: true
    },
    {
      handId: 3,
      bet: 150,
      bettor: "Team1",
      suit: "Spade",
      team1Score: 50,
      team2Score: 110,
      betAchieved: false
    },
    {
      handId: 4,
      bet: 130,
      bettor: "Team2",
      suit: "Diamond",
      team1Score: 130,
      team2Score: 30,
      betAchieved: true
    },
  ];  
  testHand: Hand = {
    handId: 1,
    bet: 100,
    bettor: "Team1",
    suit: "Heart",
    team1Score: 90,
    team2Score: 70,
    betAchieved: false
  };

  constructor(private httpService: HttpServiceService) { }

  ngOnInit() {
    this.getGames();
  }

  getGames() {
    if (this.httpService.games !== null) {
      this.games = this.httpService.games;
      console.log('Loaded games from stored object');
    }
    else {
      this.httpService.getGames().subscribe(
        (res) => {
          this.games = Object.entries(res).map(([key, value]) => ({key, value}));
          this.httpService.games = this.games;
          console.log('Get games:', this.games)
        },
        (error) => console.log('Bad get games', error)
      );
    }
    
  }

  deleteGame(index:number) {
    this.games.splice(index, 1);
    this.httpService.games = this.games;
    console.log(`Deleting position ${index}`);
  }

  openGame(game) {
    this.selectedTab += 1;
    if (this.selectedTab > 2) this.selectedTab = 0;
    this.currentGame = game.value;
    console.log(game.value);
  }

  openHand(hand) {
    this.selectedTab += 1;
    if (this.selectedTab > 2) this.selectedTab = 0;
    this.formHand = hand;
    console.log(hand);
  }

  clearHand() {
    this.formHand = null;
  }
}
