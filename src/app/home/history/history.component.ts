import { Component, OnInit, Input } from '@angular/core';
import { Observable } from "rxjs/Rx";

import { HttpServiceService } from "../../http-service.service";
import { Hand } from "../../models/hand.model";
import { Game } from "../../models/game.model";
// import { HttpHandler } from '@angular/common/http';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  
  @Input() team1: string = 'A team';
  @Input() team2: string = 'B team';
  @Input() formHand: Hand;
  team1Total: number;
  team2Total: number;
  games: any;
  editMode = false;
  observable: Observable<number>;
  selectedTab = 0;
  currentGame: Game = null;
  currentGameId: any;
  currentHand: Hand = null;
  handIndex: number;
  suits = ["Club", "Diamond", "Heart", "Spade", "None"];
  hands: Hand[] = [];
  gameIndex = null;
  changed = false;

  testHand: Hand = {
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

  titleCase(string) {
    if (string) {
      return string[0].toUpperCase() + string.slice(1);
    }
    return "";
  }

  getGames() {    
    this.httpService.getGames().subscribe(
      (res) => {
        this.games = Object.entries(res).map(([gameId, value]) => ({gameId, value}));
        this.httpService.games = this.games;
        console.log('Get games:', this.games)
      },
      (error) => console.log('Bad get games', error)
    );
  }

  deleteGame(index:number) {
    this.games.splice(index, 1);
    this.httpService.games = this.games;
    console.log(`Deleting position ${index}`);
  }

  openGame(game, i) {
    this.selectedTab += 1;
    this.currentGameId = game.gameId;
    this.currentGame = Object.assign({}, game.value);
    if (this.selectedTab > 2) this.selectedTab = 0;
    if (game.value.hands) {
      console.log(game.value.hands);
      this.hands = game.value.hands;
    }
    // this.teams.push(this.currentGame.teams.team1Name);
    // this.teams.push(this.currentGame.teams.team2Name);
    this.team1 = this.currentGame.teams.team1Name;
    this.team2 = this.currentGame.teams.team2Name;
    this.updateScores();
    // console.log(game.value);
    console.log(this.currentGame);
    this.gameIndex = i;
  }

  updateScores() {
    this.team1Total = this.hands.map(hand => hand.team1Score).reduce((prev, next) => prev + next);
    this.team2Total = this.hands.map(hand => hand.team2Score).reduce((prev, next) => prev + next);
  }

  openHand(hand, index) {
    this.selectedTab += 1;
    if (this.selectedTab > 2) this.selectedTab = 0;
    this.handIndex = index;
    this.testHand = Object.assign({}, hand);
    // this.testHand.bet = hand.bet;
    // this.testHand.bettor = hand.bettor;
    // this.testHand.team1Score = hand.team1Score;
    // this.testHand.team2Score = hand.team2Score;
    // this.testHand.betAchieved = hand.betAchieved;
    this.testHand.suit = this.titleCase(hand.suit);
    // this.formHand = hand;
    console.log(hand);
    console.log(this.testHand);
  }

  clearHand() {
    this.testHand = null;
  }

  saveChanges() {
    console.log(this.httpService.games);
    // this.hands[i] = this.testHand;
  }

  saveGames() {
    this.games.hands = Object.assign({}, this.hands);
    this.httpService.postGame(this.games);
  }

  updateGame() {
    this.currentGame.hands[this.handIndex] = Object.assign({}, this.testHand);
    //this.testHand = null;
    // console.log(this.hands);
    // console.log(this.currentGame);
    this.updateScores();
    this.currentGame.teams.team1Score = this.team1Total;
    this.currentGame.teams.team2Score = this.team2Total;
    this.currentGame.winner = this.team1Total > this.team2Total ? this.team1 : this.team2;
    // console.log(this.currentGame.winner);
    
    this.games[this.gameIndex].value = Object.assign({}, this.currentGame);
    // console.log(this.games);
    this.httpService.updateGame(this.currentGame, this.currentGameId, this.gameIndex).subscribe(
      (res:Game) => {
        // this.games = Object.entries(res).map(([gameId, value]) => ({gameId, value}));
        this.games.games = res;
        this.changed = false;
        this.selectedTab = 1;
        console.log('Response: ', res);
        console.log('Updated games:', this.games)
      },
      (error) => console.log('Bad update games', error)
    );
  }

  tabChange(event) {
    this.selectedTab = event.index;
    if (event.index < 2) {
      this.changed = false;
    }
    console.log(event);
  }
}
