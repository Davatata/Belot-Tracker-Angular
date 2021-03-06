import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, AngularFireList  } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class HttpServiceService implements OnInit, OnDestroy {
  user: Observable<firebase.User>;
  userDetails: firebase.User = null;
  token: string;
  userId: string;
  checkingUserInfo = false;
  errorMessage: string = null;
  dbRef = 'https://belot-tracker.firebaseio.com/';

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
            this.token = user['qa'];
            // console.log(this.userDetails);
          } else {
            this.userDetails = null;
            this.userId = null;
          }
        }
      );
    }

  ngOnInit() {
    this.firebaseAuth.auth.currentUser.getIdToken()
          .then(
            (token: string) => {
              this.token = token;
            }
          );
  }


  postGame(game) {
    return this.http.post(this.dbRef + `games/${this.userId}.json?auth=${this.token}`, game);
  }

  updateGame(game, gameId) {
    return this.http.put(this.dbRef + `games/${this.userId}/${gameId}.json?auth=${this.token}`, game);
  }

  deleteGame(game) {
    return this.http.delete(this.dbRef + `games/${this.userId}/${game.gameId}.json?auth=${this.token}`);
  }

  isLoggedIn() {
    if (this.userDetails === null) {
      return false;
    } else {
      return true;
    }
  }

  signup(email: string, password: string) {
    this.checkingUserInfo = true;
    this.errorMessage = null;
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        // this.loggedIn = true;
        this.firebaseAuth.auth.currentUser.getIdToken()
          .then(
            (token: string) => {
              this.token = token;
              // let uid;
              // let email;
              // if (this.userDetails !== null) {
              //   uid = this.userDetails.uid;
              //   email = this.userDetails.email;
              // }
              // let user = {userId: uid, email: email};
              // this.createUser(user).subscribe(
              //   (response) => console.log(response),
              //   (error) => console.log(error)
              // );

            }
          );
        this.router.navigate(['history']);
        this.checkingUserInfo = false;
        console.log('Success!', value);
      })
      .catch(err => {
        this.checkingUserInfo = false;
        this.errorMessage = err.message;
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    this.checkingUserInfo = true;
    this.errorMessage = null;
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        // this.loggedIn = true;
        this.firebaseAuth.auth.currentUser.getIdToken()
          .then(
            (token: string) => {
              this.token = token;
              this.router.navigate(['history']);
              this.checkingUserInfo = false;
              console.log('Nice, it worked!');
            }
          );
      })
      .catch(err => {
        this.checkingUserInfo = false;
        this.errorMessage = err.message;
        console.log('Something went wrong:', err.message);
      });
  }

  logout() {
    // this.loggedIn = false;
    this.firebaseAuth.auth.signOut();
    this.router.navigate(['signin']);
    this.userDetails = null;
    this.token = null;
    this.userId = null;
    // this.games = null;
    // console.log(this.userDetails);
  }

  getToken() {
    this.firebaseAuth.auth.currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  getGames() {
    if (!this.userId) { return; }
    return this.http.get(this.dbRef + `games/${this.userId}.json?auth=${this.token}`);
  }

  createUser(user) {
    return this.http.post(this.dbRef + 'users.json', user);
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  ngOnDestroy() {
    // this.user.unsubscribe();
  }

}


