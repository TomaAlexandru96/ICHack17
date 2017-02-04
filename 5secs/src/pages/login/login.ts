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
      HTTP.post('13.74.168.159/users', response, {})
      .then((serverResponse) => {
        this.login(serverResponse);
      })
      .catch((error) => {
        console.error(error);
      });
    })
    .catch((err) => {
      this.navCtrl.setRoot(Page1);
      console.error(err);
    });
  }

  login(userInfo) {
    console.log(userInfo);
  }
}
