import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { HttpServiceService } from "./http-service.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private httpService: HttpServiceService, private router: Router) {}

  canActivate() {
    return this.httpService.user.map((auth) =>  {
      if(auth == null) {
        console.log('access denied! Going to signin.');
        this.router.navigate(['/signin']);
        return false;
      } else {
        return true;
      }
    });
    
  }

}