import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUserService {
  public user = {loggedIn: false};

  constructor() {
  }

  public login(userInfo) {
    this.user = userInfo;
    this.user.loggedIn = true;
  }

  public logout() {
    this.user = {loggedIn: false};
  }

}
