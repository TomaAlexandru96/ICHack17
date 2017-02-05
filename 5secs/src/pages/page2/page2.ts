import { Component } from '@angular/core';
import { HTTP, MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';
declare var FileTransfer;
declare var FileUploadOptions;

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
      console.log(JSON.stringify(response));
      var win = function (r) {
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);
      }

      var fail = function (error) {
          alert("An error has occurred: Code = " + error.code);
          console.log("upload error source " + error.source);
          console.log("upload error target " + error.target);
      }
      var fileURL = encodeURI(response[0].localURL);
      var options = new FileUploadOptions();
      options.fileKey = "video";
      options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
      options.mimeType = "text/plain";

      var params = {
          "event_id": this.navParams.data['id']
      };
      options.params = params;

      var ft = new FileTransfer();
      ft.upload(fileURL, encodeURI("http://13.74.168.159/upload_video/"), win, fail, options);
    })
    .catch((err) => {
      console.error(err);
    });
  }
}
