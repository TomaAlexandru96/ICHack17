import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from 'ionic-native';
import { Page1 } from '../page1/page1';
import { HTTP } from 'ionic-native';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }

  googleClicked() {

  }

  facebookClicked() {
    Facebook.login(["public_profile", "email"])
    .then((response) => {
      // send response to server
      this.navCtrl.setRoot(Page1);
      this.login(response);
    })
    .catch((err) => {
      this.navCtrl.setRoot(Page1);
      console.log(err);
    });
  }

  login(userInfo) {
  }
}
