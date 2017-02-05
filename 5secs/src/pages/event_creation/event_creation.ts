import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { HTTP } from 'ionic-native';
import { CurrentUserService } from '../../providers/current_user';

@Component({
  selector: 'page-event_creation',
  templateUrl: 'event_creation.html'
})
export class EventCreationPage {
  startDate;
  endDate;
  startTime;
  endTime;
  name = "";
  description = "";

  constructor(public navCtrl: NavController, public params: NavParams, public user: CurrentUserService) {
    this.setUpTimes();
  }

  setUpTimes() {
    let now = new Date(Date.now());
    let after1h = new Date(Date.now() + 60*60*1000);
    this.startDate = this.getDate(now);
    this.endDate = this.getDate(after1h);
    this.startTime = this.getTime(now);
    this.endTime = this.getTime(after1h);
  }

  getDate(date) {
    return date.getFullYear() + "-" + this.with0(date.getMonth()) + "-" + this.with0(date.getDate());
  }

  getTime(date) {
    return this.with0(date.getHours()) + ":" + this.with0(date.getMinutes());
  }

  with0(nr) {
    return nr / 10 >= 1 ? nr.toString() : "0" + nr.toString();
  }

  getISO(date, time) {
    var d = date.split('-');
    var t = time.split(':');

    return new Date(d[0],d[1],d[2],t[0],t[1]).toISOString();
  }

  createEvent() {
    var data = {
        user_id: (this.user.user as any).user_id,
        title: this.name,
        address: this.params.data['address'],
        start_time: this.getISO(this.startDate, this.startTime),
        end_time: this.getISO(this.endDate, this.endTime),
        description: this.description,
        longitude: this.params.data['longitude'],
        latitude: this.params.data['latitude']
      };
    HTTP.post("http://13.74.168.159/events/", data, {})
    .then((response) => {
      this.params.data['return'].refresh();
      this.navCtrl.pop();
    })
    .catch((err) => {
      console.error(err);
    });
  }
}
