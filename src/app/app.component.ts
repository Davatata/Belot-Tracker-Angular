import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpServiceService } from './http-service.service';

import { PostItem } from './models/postItemModel.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private loading: boolean = false;
  private list: Observable<PostItem>;
  email: string;
  password: string;

  constructor(private httpService: HttpServiceService) {}
  
  title = 'app';
  game;
  loggedIn = false;

  logout() {
    this.httpService.logout();
  }

  // getItems(term:string) {
  //   this.loading = true;
  //   this.list = this.httpService.search(term);
  // }

  // postGame() {
  //   let game = {
  //     '1': {
  //       'games': {
  //         '1': {
  //           'winner': 'teamDave',
  //           'teams': {
  //             'team1Name': 'teamDave',
  //             'team2Name': 'teamDave',
  //             'team1Score': 1000,
  //             'team2Score': 500              
  //           },
  //           'hands': {
  //             '1': {
  //               'bet': 100,
  //               'bettor': 'teamDave',
  //               'suit': 'club',
  //               'team1Score': 110,
  //               'team2Score': 50,
  //               'betAchieved': true
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   this.game = this.httpService.postGame(game);
  // }

  
}
