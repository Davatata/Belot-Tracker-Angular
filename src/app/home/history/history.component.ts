import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from "rxjs/Rx";

import {MatIconRegistry} from '@angular/material';

import { HttpServiceService } from "../../http-service.service";
import { Hand } from "../../models/hand.model";
import { Game } from "../../models/game.model";


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit {
  
  @Input() team1: string = 'A team';
  @Input() team2: string = 'B team';
  @Input() formHand: Hand;
  team1Total: number = 0;
  team2Total: number = 0;
  games: any = [];
  editMode = false;
  observable: Observable<number>;
  selectedTab = 0;
  currentGame: Game = null;
  currentGameId: any;
  currentHand: Hand = null;
  handIndex: number;
  suits = ["None", "Club", "Diamond", "Heart", "Spade"];
  hands: Hand[] = [];
  gameIndex = null;
  changed = false;
  oldTeam1: string;
  oldTeam2: string;
  tempHand: Hand;
  bettorArray: string[] = ['testA', 'testB'];
  multiplier = 1;
  gameGoal: number;
  // editHand: boolean;
  newHand: boolean;

  testHand: Hand = {
    bet: 80,
    bettor: "BlankTeam",
    suit: "None",
    team1Score: 82,
    team2Score: 80,
    team1Bonus: 1,
    team2Bonus: 1,
    team1Sum: 162,
    team2Sum: 80,
    special: '',
    betAchieved: true
  };

  constructor(private httpService: HttpServiceService, 
              private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getGames();
  }

  ngAfterViewChecked() {   
    this.cd.detectChanges();   
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
        if (res === null) {
          console.log("No games found.");
        } else {
          this.games = Object.entries(res).map(([gameId, value]) => ({gameId, value}));
          console.log('Get games:', this.games);
        }        
      },
      (error) => console.log('Bad get games', error)
    );
  }

  deleteGame(index:number) {
    this.games.splice(index, 1);
    //this.httpService.games = this.games;
    console.log(`Deleting position ${index}`);
  }

  openGame(game, i) {
    this.selectedTab += 1;
    this.changed = false;
    this.currentGameId = game.gameId;

    this.currentGame = Object.assign({}, game.value);
    this.oldTeam1 = this.team1 = this.currentGame.teams.team1Name;
    this.oldTeam2 = this.team2 = this.currentGame.teams.team2Name;
    this.team1Total = this.currentGame.teams.team1Score;
    this.team2Total = this.currentGame.teams.team2Score;
    console.log('currentGame set: ', this.currentGame);
    if (this.selectedTab > 2) {
      this.selectedTab = 0;
    }
    if (!game.value.hands) {
      console.log("Bad hands: ", game.value.hands);
    }
    
    this.gameIndex = i;
    console.log('gameIndex: ', this.gameIndex)
  }

  updateTeamScores(teamNumber) {
    if (teamNumber === 1) {
      // if (this.testHand.team1Score === null) this.testHand.team1Score = 0;
      this.testHand.team2Score = 162 - this.testHand.team1Score;
    } else {
      // if (this.testHand.team2Score === null) this.testHand.team2Score = 0;
      this.testHand.team1Score = 162 - this.testHand.team2Score;
    }
  }

  updateScores() { 
    this.team1Total = this.currentGame.hands.map(hand => hand.team1Score).reduce((prev, next) => prev + next);
    this.team2Total = this.currentGame.hands.map(hand => hand.team2Score).reduce((prev, next) => prev + next);
  }

  updateMultiplier(value) {
    if (value === "") {
      this.multiplier = 1;
    } else if (value === "Coincher") {
      this.multiplier = 2;
    } else {
      this.multiplier = 4;
    }
    console.log('New multiplier: ', this.multiplier);
  }

  openHand(hand, index) {
    this.changed = false;
    this.selectedTab += 1;
    if (this.selectedTab > 2) this.selectedTab = 0;
    // this.editHand = true;
    this.handIndex = index;
    console.log('Test hand: Before assign', this.testHand, index);
    this.testHand = Object.assign({}, hand);
    this.addMissingProperties();
    this.testHand.suit = this.titleCase(hand.suit);
    this.multiplier = 1;
    this.newHand = false;
    console.log('Test hand: After assign', this.testHand, index);
    this.oldTeam1 = this.team1 = this.currentGame.teams.team1Name;
    this.oldTeam2 = this.team2 = this.currentGame.teams.team2Name;
  }

  clearHand() {
    this.testHand = null;
  }

  saveChanges() {
    //console.log('Service games: ', this.httpService.games);
    // this.currentGame.hands[i] = this.testHand;
  }

  saveGames() {
    // this.games.hands = Object.assign({}, this.currentGame.hands);
    // this.httpService.postGame(this.games);
  }

  updateGame() {
    console.log('TestHand:' ,this.testHand);
    this.currentGame.hands[this.handIndex] = Object.assign({}, this.testHand);
    this.fixMissingScores();
    this.currentGame.teams.team1Name = this.team1;
    this.currentGame.teams.team2Name = this.team2;
    this.updateTeamNames();    
    this.updateScores();
    this.currentGame.teams.team1Score = this.team1Total;
    this.currentGame.teams.team2Score = this.team2Total;

    this.currentGame.winner = this.team1Total > this.team2Total ? 
                              this.currentGame.teams.team1Name : 
                              this.currentGame.teams.team2Name;
    this.updateBetAchieved(this.handIndex);
    if (this.gameIndex < this.games.length) {
      console.log('this.gameIndex < this.games.length');
      // this.games[this.gameIndex].value = Object.assign({}, this.currentGame);
    } else {
      console.log('this.gameIndex >= this.games.length');
      // this.games[this.gameIndex] = {value:null};
    }  
    
    console.log('New game: ', this.games[this.gameIndex]);
    // console.log(this.games);
    if (this.currentGameId) {
      this.httpService.updateGame(this.currentGame, this.currentGameId, this.gameIndex).subscribe(
        (res:Game) => {
          this.getGames();
          // this.games[this.gameIndex].value = res;
          this.changed = false;
          // this.editHand = false;
          this.newHand = false;
          this.selectedTab = 1;
          console.log('Response: ', res);
          console.log('Updated games:', this.games)
        },
        (error) => console.log('Bad update games', error)
      );
    } else {
      this.httpService.postGame(this.currentGame).subscribe(
        (res:any) => {
          this.getGames();
          this.changed = false;
          this.newHand = false;
          this.selectedTab = 1;
          this.currentGameId = res.name;
          console.log('Response: ', res);
          console.log('Created games:', this.games)
        },
        (error) => console.log('Bad create game', error)
      );
    }
    
  }

  tabChange(event) {
    this.selectedTab = event.index;
    if (event.index < 2) {
      this.changed = false;
    }
  }

  indexChanged(event) {
    // console.log("Tab chosen:", event);
    // this.openGame(this.currentGameId, this.gameIndex);
  }

  // when a team name is changed, change all instances
  updateTeamNames() {
    let newTeam1 = this.currentGame.teams.team1Name;
    let newTeam2 = this.currentGame.teams.team2Name;
    
    this.currentGame.hands = this.currentGame.hands.map(hand => {
      if (hand.bettor === this.oldTeam1) {
        hand.bettor = newTeam1;
      } else if (hand.bettor === this.oldTeam2) {
        hand.bettor = newTeam2;
      }
      return hand;
    });
    this.oldTeam1 = newTeam1;
    this.oldTeam2 = newTeam2;
  }

  updateBetAchieved(handIndex) {
    let bettor = this.currentGame.hands[handIndex].bettor;
    let achieved = false;
    if (bettor === this.currentGame.teams.team1Name) {
      if (this.currentGame.hands[handIndex].bet <= this.currentGame.hands[handIndex].team1Score) {
        achieved = true;
      }
    } else {
      if (this.currentGame.hands[handIndex].bet <= this.currentGame.hands[handIndex].team2Score) {
        achieved = true;
      }
    }
    this.currentGame.hands[handIndex].betAchieved = achieved;
  }

  getColors(hand, teamNumber) {
    let styles = {};
    if (teamNumber === 1 && hand.bettor === this.currentGame.teams.team1Name) {
      styles = {'background-color': hand.team1Score >= hand.bet ? '#acffac' : '#ffacac'}
    } else if (teamNumber === 2 && hand.bettor === this.currentGame.teams.team2Name) {
      styles = {'background-color': hand.team2Score >= hand.bet ? '#acffac' : '#ffacac'}
    } else {
      styles = { 'background-color': 'none'};
    }
    return styles;
  }

  addMissingProperties() {
    if (!this.testHand.hasOwnProperty('team1Bonus'))
      this.testHand.team1Bonus = -1;
    if (!this.testHand.hasOwnProperty('team2Bonus'))
      this.testHand.team2Bonus = -1;
    if (!this.testHand.hasOwnProperty('special'))
      this.testHand.special = '';
  }

  fixMissingScores() {
    this.currentGame.hands = this.currentGame.hands.map(hand => {
      hand.bet = this.fixScoreItem(hand.bet, 80, 162);
      hand.team1Score = this.fixScoreItem(hand.team1Score, 0, 162);
      hand.team2Score = this.fixScoreItem(hand.team2Score, 0, 162);
      hand.team1Bonus = this.fixScoreItem(hand.team1Bonus, 0, this.gameGoal);
      hand.team2Bonus = this.fixScoreItem(hand.team2Bonus, 0, this.gameGoal);
      return hand;
    });
  }

  fixScoreItem(value, min, max): number {
    if (typeof(value) !== "number" || value < min) {
      return min;
    } else if (value > max) {
      return max;
    }
    return value;
  }

  createHand() {
    this.handIndex = this.currentGame.hands.length;
    // this.editHand = false;
    this.newHand = true;

    this.selectedTab += 1;
    this.testHand.bet = 80;
    this.testHand.betAchieved = false;
    this.testHand.special = "";
    this.testHand.suit = "None";
    this.testHand.team1Score = 0;
    this.testHand.team2Score = 0;
    this.testHand.team1Bonus = 0;
    this.testHand.team2Bonus = 0;
  }

  goodSize(teamName) {
    return teamName.length > 9 ? teamName.substring(0,9)+'...' : teamName;
  }

  createGame() {
    this.team1 = this.oldTeam1 = "";
    this.team2 = this.oldTeam2 = "";
    this.team1Total = 0;
    this.team2Total = 0;
    this.gameIndex = null;
    this.currentGameId = null;
    this.currentGame = Object.assign({},
    {
      winner: '',
      teams: { 
        team1Name: '',
        team2Name: '',
        team1Score: 0,
        team2Score: 0,
      },
      hands: []
    });
    this.gameIndex = this.games.length;
    this.createHand();
  }

  checkNames() {
    if (this.team1 !== this.oldTeam1 || this.team2 !== this.oldTeam2) {
      this.changed = true;
    }
  }

}
