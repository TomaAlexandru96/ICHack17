import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from 'ionic-native';
import { Page1 } from '../page1/page1';
import { HTTP } from 'ionic-native';
import { MyApp } from '../../app/app.component';
import { CurrentUserService } from '../../providers/current_user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public user: CurrentUserService) {
  }

  googleClicked() {
    // demo
    this.login(
      {
        data: JSON.stringify({
          user_id: 845643595578874,
          name: "Alexandru Toma",
          picture_url: "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/11954636_601113870031849_6228280437209174273_n.jpg?oh=399176e065b698422604f58ab303c52f&oe=590D36B5"
        })
      }
    );
  }

  facebookClicked() {
    Facebook.login(["public_profile", "email"])
    .then((response) => {
      // send response to server
      HTTP.post('http://13.74.168.159/users/', response['authResponse'], {})
      .then((serverResponse) => {
        this.login(serverResponse);
      })
      .catch((error) => {
        console.error(error);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  login(serverInfo) {
    this.navCtrl.setRoot(Page1);
    this.user.login(JSON.parse(serverInfo.data));
  }
}
