import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from "rxjs/Rx";

import { HttpServiceService } from "../../http-service.service";
import { Hand } from "../../models/hand.model";
import { Game } from "../../models/game.model";
import { toUnicode } from 'punycode';
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
  team1Total: number = 0;
  team2Total: number = 0;
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
  oldTeam1: string;
  oldTeam2: string;
  tempHand: Hand;
  bettorArray: string[] = ['testA', 'testB'];

  testHand: Hand = {
    bet: 80,
    bettor: "BlankTeam",
    suit: "None",
    team1Score: 80,
    team2Score: 80,
    betAchieved: true
  };

  constructor(private httpService: HttpServiceService, private cd: ChangeDetectorRef) { }

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
        this.games = Object.entries(res).map(([gameId, value]) => ({gameId, value}));
        // this.games: {
        //   gameId: string,
        //   value: Game
        // }
        console.log('Get games:', this.games)
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

  updateScores() {
    this.team1Total = this.currentGame.hands.map(hand => hand.team1Score).reduce((prev, next) => prev + next);
    this.team2Total = this.currentGame.hands.map(hand => hand.team2Score).reduce((prev, next) => prev + next);
  }

  openHand(hand, index) {
    // this.tempHand = hand;
    this.selectedTab += 1;
    if (this.selectedTab > 2) this.selectedTab = 0;
    this.handIndex = index;
    this.testHand = Object.assign({}, hand);
    this.testHand.suit = this.titleCase(hand.suit);
    this.oldTeam1 = this.currentGame.teams.team1Name;
    this.oldTeam2 = this.currentGame.teams.team2Name;
    console.log('Test hand: ', this.testHand, index);
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
    // this.currentGame.hands[this.handIndex] = Object.assign({}, this.testHand);
    // this.updateTeamName(this.testHand.bettor);
    // this.currentGame.hands[this.handIndex] = Object.assign({}, this.currentHand);
    // this.tempHand = Object.assign({}, this.currentHand);
    // console.log(this.currentGame);
    console.log('TestHand:' ,this.testHand);
    this.currentGame.hands[this.handIndex] = this.testHand;
    this.updateTeamNames();
    
    // this.currentGame.teams.team1Name = this.team1;
    // this.currentGame.teams.team2Name = this.team2;
    this.updateScores();
    this.currentGame.teams.team1Score = this.team1Total;
    this.currentGame.teams.team2Score = this.team2Total;
    this.currentGame.winner = this.team1Total > this.team2Total ? 
                              this.currentGame.teams.team1Name : 
                              this.currentGame.teams.team2Name;
    this.updateBetAchieved(this.handIndex);
    this.games[this.gameIndex].value = Object.assign({}, this.currentGame);
    console.log('New game: ', this.games[this.gameIndex]);
    // console.log(this.games);
    this.httpService.updateGame(this.currentGame, this.currentGameId, this.gameIndex).subscribe(
      (res:Game[]) => {
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
    // console.log(event);
  }

  // when a team name is changed, change all instances
  updateTeamNames() {
    let newTeam1 = this.currentGame.teams.team1Name;
    let newTeam2 = this.currentGame.teams.team2Name;
    // if (this.currentGame.teams.team1Name !== this.oldTeam1) {
      // TODO: update team1Name throughout the currentGame (hands[]/winner/teams[])
    
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
    // this.testHand.bettor = 'blank';
  }

  updateTeamScores(teamNumber) {
    if (teamNumber === 1) {
      this.testHand.team2Score = 162 - this.testHand.team1Score;
    } else {
      this.testHand.team1Score = 162 - this.testHand.team2Score;
    }
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
      styles = {
        'background-color': hand.team1Score >= hand.bet ? '#acffac' : '#ffacac'
      }
    } else if (teamNumber === 2 && hand.bettor === this.currentGame.teams.team2Name) {
      styles = {
        'background-color': hand.team2Score >= hand.bet ? '#acffac' : '#ffacac'
      }
    } else {
      styles = { 'background-color': 'none'};
    }
    return styles;
  }
}
