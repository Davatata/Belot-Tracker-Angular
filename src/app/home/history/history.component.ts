import { Component, OnInit } from '@angular/core';

import { HttpServiceService } from "../../http-service.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  games: any;

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
}
