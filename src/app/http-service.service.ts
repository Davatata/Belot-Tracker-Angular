import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import 'rxjs/add/operator/map';

import { AngularFireDatabase, AngularFireList  } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from "firebase/app";

// import { PostItem } from "./models/postItemModel.model";
// import { Game } from "./models/game.model";
// import { Hand } from "./models/hand.model";
// import { User } from "./models/user.model";

@Injectable()
export class HttpServiceService implements OnDestroy {

  // games: Observable<any[]>;
  // newGame;
  user: Observable<firebase.User>;
  userDetails: firebase.User = null;
  // loggedIn = false;
  token: string;
  // games: Observable<Game[]> = null;
  userId: string;

  constructor(
    private http: HttpClient,
    private router: Router, 
    private firebaseAuth: AngularFireAuth,
    private db: AngularFireDatabase) {
      this.user = firebaseAuth.authState;
      this.user.subscribe(
        (user) => {
          if (user) {
            this.userDetails = user;
            this.userId = user.uid;
            //console.log(this.userDetails);
          } else {
            this.userDetails = null;
            this.userId = null;
          }
        }
      );
    }

  // apiRoot = 'https://jsonplaceholder.typicode.com/posts';
  dbRef = 'https://belot-tracker.firebaseio.com/';

  // jsonplaceholder test
  // search(term: string): Observable<PostItem> {
  //   let apiUrl = this.apiRoot + term;
  //   return this.http.get<PostItem>(apiUrl);
  // }

  postGame(game) {
    return this.http.post(this.dbRef + `games/${this.userId}.json`, game);
  }

  updateGame(game, gameId) {
    return this.http.put(this.dbRef + `games/${this.userId}/${gameId}.json`, game);
  }

  deleteGame(game) {
    return this.http.delete(this.dbRef + `games/${this.userId}/${game.gameId}.json`);
  }

  isLoggedIn() {
    if (this.userDetails === null) {
      return false;
    } else {
      return true;
    }
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        // this.loggedIn = true;
        this.firebaseAuth.auth.currentUser.getIdToken()
          .then(
            (token:string) => {
              this.token = token;
              let user = {userId: this.userDetails.uid, email: this.userDetails.email};
              this.createUser(user).subscribe(
                (response) => console.log(response),
                (error) => console.log(error)
              );
              // this.http.post<User>(
              //   this.db + `/users/${user.userId}/.json`, user.email
              // );
              
            }
          )
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
        // this.loggedIn = true;
        this.firebaseAuth.auth.currentUser.getIdToken()
          .then(
            (token:string) => {
              this.token = token;
              this.router.navigate(['home']);
              console.log('Nice, it worked!');
            }
          )
        
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    // this.loggedIn = false;
    this.firebaseAuth.auth.signOut();
    this.router.navigate(['signin']);
    this.userDetails = null;
    //this.games = null;
    // console.log(this.userDetails);
  }

  getToken() {
    this.firebaseAuth.auth.currentUser.getIdToken()
      .then(
        (token:string) => this.token = token
      );
    return this.token;
  }

  getGames() {
    if (!this.userId) return;
    return this.http.get(this.dbRef + `games/${this.userId}.json`);
  }
  
  createUser(user) {
    return this.http.post(this.dbRef + 'users.json', user);
  }

  ngOnDestroy() {
    // this.user.unsubscribe();
  }

}


