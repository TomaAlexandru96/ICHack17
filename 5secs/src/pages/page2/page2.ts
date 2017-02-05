import { Component } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  data = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  captureVideo() {
    MediaCapture.captureVideo({limit: 1, duration: 5})
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.error(err);
    });
  }
}
