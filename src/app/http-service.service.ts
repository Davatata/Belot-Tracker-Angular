import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import 'rxjs/add/operator/map';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from "firebase/app";

import { PostItem } from "./models/postItemModel.model";
import { Game } from "./models/game.model";
import { Hand } from "./models/hand.model";
import { User } from "./models/user.model";

@Injectable()
export class HttpServiceService {

  games: Observable<any[]>;
  newGame;
  user: Observable<firebase.User>;
  loggedIn = false;

  constructor(private http: HttpClient,
              private router: Router, 
              private firebaseAuth: AngularFireAuth) {
                this.user = firebaseAuth.authState;
              }

  apiRoot = 'https://jsonplaceholder.typicode.com/posts';
  apiFB = 'https://belot-tracker.firebaseio.com/belot-tracker/';

  // jsonplaceholder test
  search(term: string): Observable<PostItem> {
    let apiUrl = this.apiRoot + term;
    return this.http.get<PostItem>(apiUrl);
  }

  postGame(game) {
    return this.http.post(this.apiFB, game);
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.loggedIn = true;
        this.router.navigate(['home']);
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        this.loggedIn = true;
        this.router.navigate(['home']);
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.loggedIn = false;
    this.firebaseAuth
      .auth
      .signOut();
  }
  
}


