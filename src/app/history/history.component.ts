import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpServiceService } from '../http-service.service';
import { Hand } from '../models/hand.model';
import { Game } from '../models/game.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})

export class HistoryComponent implements OnInit, AfterViewChecked {

  @Input() team1 = 'A team';
  @Input() team2 = 'B team';
  @Input() formHand: Hand;
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();

  team1Total = 0;
  team2Total = 0;
  games: any = [];
  editMode = false;
  confirmDelete = false;
  observable: Observable<number>;
  selectedTab = 0;
  currentGame: Game = null;
  currentGameId: any;
  currentHand: Hand = null;
  handIndex: number;
  suits = ['None', 'Club', 'Diamond', 'Heart', 'Spade'];
  hands: Hand[] = [];
  gameIndex = null;
  toDeleteIndex = null;
  toDeleteTeams = null;
  toDeleteHandIndex = null;
  toDeleteHand = null;
  changed = false;
  oldTeam1: string;
  oldTeam2: string;
  tempHand: Hand;
  // bettorArray: string[] = ['testA', 'testB'];
  multiplier = 1;
  gameGoal: number;
  newHand: boolean;
  deletedItems: any = {
    game: null,
    gameIndex: null,
    hand: null,
    handIndex: null
  };

  testHand: Hand = {
    bet: 80,
    bettor: 'BlankTeam',
    suit: 'None',
    team1Score: 82,
    team2Score: 80,
    team1Bonus: 1,
    team2Bonus: 1,
    team1Sum: 162,
    team2Sum: 80,
    special: '',
    betAchieved: true
  };

  betValues = [82, 90, 100, 110, 120, 130, 140, 150, 162, 250];
  allTricks: boolean;

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
    return '';
  }

  toggleDelete() {
    this.confirmDelete = !this.confirmDelete;
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  getGames() {
    this.httpService.getGames().subscribe(
      (res) => {
        if (res === null) {
          console.log('No games found.');
        } else {
          this.games = Object.entries(res).map(([gameId, value]) => ({gameId, value})).reverse();
          console.log('Get games:', this.games);
        }
      },
      (error) => console.log('Bad get games', error)
    );
  }

  updateDeleteItems(teams, index) {
    this.toDeleteIndex = index;
    this.toDeleteTeams = teams;
  }

  updateDeleteHand(hand, index) {
    this.toDeleteHandIndex = index;
    this.toDeleteHand = hand;
  }

  deleteGame() {
    const index = this.toDeleteIndex;
    this.deletedItems.game = this.games.splice(index, 1)[0];
    this.deletedItems.gameIndex = index;
    console.log(`Deleting game at position ${index}`);
    // console.table(this.deletedItems.game);
    this.toggleDelete();
    // this.toggleEdit();
    this.httpService.deleteGame(this.deletedItems.game).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteHand() {
    const index = this.toDeleteHandIndex;
    this.deletedItems.hand = this.currentGame.hands.splice(index, 1)[0];
    console.log(this.currentGame.hands);
    this.deletedItems.handIndex = index;
    this.updateScores();
    this.updateWinner();
    console.log(`Deleting hand at position ${index}`);
    // console.table(this.deletedItems.hand);
    this.toggleDelete();
    // this.toggleEdit();
    this.httpService.updateGame(this.currentGame, this.currentGameId).subscribe(
      (res: Game) => {
        this.getGames();
        console.log('Hand removed.');
      },
      (error) => console.log('Error while updating hands:', error)
    );
  }

  openGame(game, i) {
    this.selectedTab = 1;
    this.changed = false;
    this.currentGameId = game.gameId;

    this.currentGame = Object.assign({}, game.value);
    this.currentGame = this.addMissingGameProperties(this.currentGame);
    this.oldTeam1 = this.team1 = this.currentGame.teams.team1Name;
    this.oldTeam2 = this.team2 = this.currentGame.teams.team2Name;
    this.team1Total = this.currentGame.teams.team1Score;
    this.team2Total = this.currentGame.teams.team2Score;
    console.log('currentGame set: ', this.currentGame);
    if (!game.value.hands) {
      console.log('Bad hands: ', game.value.hands);
    }

    this.gameIndex = i;
    console.log('gameIndex: ', this.gameIndex);
  }

  updateTeamScores(teamNumber) {
    this.allTricks = false;

    if (teamNumber === 1) {
      this.testHand.team2Score = 162 - this.testHand.team1Score;
    } else {
      this.testHand.team1Score = 162 - this.testHand.team2Score;
    }

    if (this.testHand.team1Score === 162 || this.testHand.team2Score === 162) {
      this.allTricks = true;
    }
  }

  updateHandScore() {
    const team1Name = this.currentGame.teams.team1Name;
    // let team2Name = this.currentGame.teams.team2Name;

    const hand = Object.assign({}, this.currentGame.hands[this.handIndex]);

    this.multiplier = 1;
    if (hand.special === 'Sur-Coincher') {
      this.multiplier = 4;
    } else if (hand.special === 'Coincher') {
      this.multiplier = 2;
    }

    let capot = 0;
    // WORKING ON: adding 'Capot' option on betting (saying you'll take all tricks)
    if (hand.bet === 250) {
      if (hand.betAchieved) {
        capot = 250;
      }
    }

    // TODO: Handle case when 'capot' is called, currently score is too high.
    if (hand.betAchieved) {
      if (hand.bettor === team1Name) {
        hand.team1Sum = (hand.bet * this.multiplier) + (capot ? capot : hand.team1Score) + hand.team1Bonus;
        hand.team2Sum = hand.team2Score + hand.team2Bonus;
      } else {
        hand.team2Sum = (hand.bet * this.multiplier) + (capot ? capot : hand.team2Score) + hand.team2Bonus;
        hand.team1Sum = hand.team1Score + hand.team1Bonus;
      }
    } else {
      // console.log('bet failed', hand.bettor);
      if (hand.bettor === team1Name) {
        hand.team2Sum = 162 + (hand.bet * this.multiplier) + capot + hand.team2Bonus;
        hand.team1Sum = 0 + hand.team1Bonus;
      } else {
        hand.team1Sum = 162 + (hand.bet * this.multiplier) + capot + hand.team1Bonus;
        hand.team2Sum = 0 + hand.team2Bonus;
      }
    }
    if (isNaN(hand.team1Sum)) {
      hand.team1Sum = 0;
    }
    if (isNaN(hand.team2Sum)) {
      hand.team2Sum = 0;
    }

    this.currentGame.hands[this.handIndex] = Object.assign({}, hand);
  }

  // TODO: update scores according to if bet was met or not.
  updateScores() {
    if (!this.confirmDelete) {
      this.updateHandScore();
    }
    this.team1Total = this.currentGame.hands.map(hand => hand.team1Sum).reduce((prev, next) => prev + next, 0);
    this.team2Total = this.currentGame.hands.map(hand => hand.team2Sum).reduce((prev, next) => prev + next, 0);
    this.currentGame.teams.team1Score = this.team1Total;
    this.currentGame.teams.team2Score = this.team2Total;
  }

  updateMultiplier(value) {
    if (value === 'Coincher') {
      this.multiplier = 2;
    } else if (value === 'Sur-Coincher') {
      this.multiplier = 4;
    } else {
      this.multiplier = 1;
    }
    console.log('New multiplier: ', this.multiplier);
  }

  openHand(hand, index) {
    this.changed = false;
    this.selectedTab = 2;
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
    this.tempHand = Object.assign({}, this.testHand);
    console.log(this.tempHand);
  }

  checkChange() {
    if (this.newHand) { return; }
    this.changed = false;
    if (
      this.tempHand.bet !== this.testHand.bet ||
      this.tempHand.bettor !== this.testHand.bettor ||
      this.tempHand.special !== this.testHand.special ||
      this.tempHand.suit !== this.testHand.suit ||
      this.tempHand.team1Score !== this.testHand.team1Score ||
      this.tempHand.team2Score !== this.testHand.team2Score ||
      this.tempHand.team1Bonus !== this.testHand.team1Bonus ||
      this.tempHand.team2Bonus !== this.testHand.team2Bonus
    ) {
      this.changed = true;
      return;
    }
  }

  clearHand() {
    this.testHand = null;
  }

  updateGame() {
    console.log('TestHand:' , this.testHand);
    this.currentGame.hands[this.handIndex] = Object.assign({}, this.testHand);
    this.fixMissingScores();
    this.currentGame.teams.team1Name = this.team1;
    this.currentGame.teams.team2Name = this.team2;
    this.updateTeamNames();

    this.updateBetAchieved(this.handIndex);
    this.updateScores();

    this.updateWinner();
    // if (this.gameIndex < this.games.length) {
    //   console.log('this.gameIndex < this.games.length');
    // } else {
    //   console.log('this.gameIndex >= this.games.length');
    // }

    console.log('New game: ', this.games[this.gameIndex]);
    if (this.currentGameId) {
      this.httpService.updateGame(this.currentGame, this.currentGameId).subscribe(
        (res: Game) => {
          this.getGames();
          this.changed = false;
          this.newHand = false;
          this.selectedTab = 1;
          console.log('Response: ', res);
          console.log('Updated games:', this.games);
        },
        (error) => console.log('Bad update games', error)
      );
    } else {
      this.httpService.postGame(this.currentGame).subscribe(
        (res: any) => {
          this.getGames();
          this.changed = false;
          this.newHand = false;
          this.selectedTab = 1;
          this.currentGameId = res.name;
          console.log('Response: ', res);
          console.log('Created games:', this.games);
        },
        (error) => console.log('Bad create game', error)
      );
    }

  }

  updateWinner() {
    this.currentGame.winner = this.team1Total > this.team2Total ?
                              this.currentGame.teams.team1Name :
                              this.currentGame.teams.team2Name;
  }

  // when a team name is changed, change all instances
  updateTeamNames() {
    const newTeam1 = this.currentGame.teams.team1Name;
    const newTeam2 = this.currentGame.teams.team2Name;

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
    const hand: Hand = this.currentGame.hands[handIndex];
    const bettor = hand.bettor;
    let achieved = false;
    if (bettor === this.currentGame.teams.team1Name) {
      if (hand.bet === 250) {
        if (hand.team1Score === 162) {
          achieved = true;
        }
      } else {
        if (hand.bet <= hand.team1Score + hand.team1Bonus) {
          achieved = true;
        }
      }
    } else {
      if (hand.bet === 250) {
        if (hand.team1Score === 162) {
          achieved = true;
        }
      } else {
        if (hand.bet <= hand.team2Score + hand.team2Bonus) {
          achieved = true;
        }
      }
    }
    this.currentGame.hands[handIndex].betAchieved = achieved;
  }

  getColors(hand, teamNumber) {
    let styles = {};
    if (teamNumber === 1 && hand.bettor === this.currentGame.teams.team1Name) {
      styles = {'background-color': hand.betAchieved ? '#acffac' : '#ffacac'};
    } else if (teamNumber === 2 && hand.bettor === this.currentGame.teams.team2Name) {
      styles = {'background-color': hand.betAchieved ? '#acffac' : '#ffacac'};
    } else {
      styles = { 'background-color': 'none'};
    }
    return styles;
  }

  addMissingProperties() {
    if (!this.testHand.hasOwnProperty('team1Bonus')) {
      this.testHand.team1Bonus = -1;
    }
    if (!this.testHand.hasOwnProperty('team2Bonus')) {
      this.testHand.team2Bonus = -1;
    }
    if (!this.testHand.hasOwnProperty('special')) {
      this.testHand.special = '';
    }
  }

  addMissingGameProperties(game: Game): Game {
    if (!game.hands) {
      game.hands = [];
    }
    return game;
  }

  fixMissingScores() {
    this.currentGame.hands = this.currentGame.hands.map(hand => {
      // hand.bet = this.fixScoreItem(hand.bet, 80, 162);
      hand.team1Score = this.fixScoreItem(hand.team1Score, 0, 162);
      hand.team2Score = this.fixScoreItem(hand.team2Score, 0, 162);
      // hand.team1Bonus = this.fixScoreItem(hand.team1Bonus, 0, this.gameGoal);
      // hand.team2Bonus = this.fixScoreItem(hand.team2Bonus, 0, this.gameGoal);
      return hand;
    });
  }

  fixScoreItem(value: number, min: number, max: number): number {
    if (typeof(value) !== 'number' || value < min) {
      return min;
    } else if (value > max) {
      return max;
    }
    return value;
  }

  createHand() {
    const [team1, team2] = [this.currentGame.teams.team1Name, this.currentGame.teams.team2Name];
    if (team1) { this.team1 = team1; }
    if (team2) { this.team2 = team2; }
    this.handIndex = this.currentGame.hands.length ? this.currentGame.hands.length : 0;
    this.newHand = true;
    this.changed = true;
    this.selectedTab = 2;
    this.testHand.bet = null;
    this.testHand.betAchieved = false;
    this.testHand.special = '';
    this.testHand.suit = 'None';
    this.testHand.team1Score = null;
    this.testHand.team2Score = null;
    this.testHand.team1Bonus = 0;
    this.testHand.team2Bonus = 0;
  }

  goodSize(teamName) {
    return teamName.length > 9 ? teamName.substring(0, 9) + '...' : teamName;
  }

  createGame() {
    this.team1 = this.oldTeam1 = '';
    this.team2 = this.oldTeam2 = '';
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
    // this.newHand = false;
  }

  checkNames() {
    if (this.team1 !== this.oldTeam1 || this.team2 !== this.oldTeam2) {
      this.changed = true;
    }
  }

}
