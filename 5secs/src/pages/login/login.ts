import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook } from 'ionic-native';

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
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
