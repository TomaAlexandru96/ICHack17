import { Component } from '@angular/core';
import { HTTP, MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  data = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = navParams.data;
  }

  captureVideo() {
    MediaCapture.captureVideo({limit: 1, duration: 5})
    .then((response) => {
      HTTP.uploadFile("http://13.74.168.159/upload_video/", {
        event_id: this.navParams.data['id']
      }, {}, response[0].fullPath, "video")
      .then((serverResponse) => {
        console.log(serverResponse);
      })
      .catch((err) => {
        console.error(err);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }
}
