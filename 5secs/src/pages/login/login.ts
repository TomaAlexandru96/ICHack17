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

  }

  facebookClicked() {
    Facebook.login(["public_profile", "email"])
    .then((response) => {
      // send response to server
      console.log(response);
      HTTP.post('http://13.74.168.159/users/', response, {})
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

  login(userInfo) {
    this.navCtrl.setRoot(Page1);
    user.login();
  }
}
