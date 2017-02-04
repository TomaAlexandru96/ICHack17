import { Component } from '@angular/core';
import {Geolocation} from 'ionic-native'
import { NavController } from 'ionic-angular';

declare var L;
var loc;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZmFuZ3lpIiwiYSI6ImNpeXI5dXBuZzAwMGszM3FudTQ3bG9tcDQifQ.25ONADCYigEjnEHUo0pRWg';
    var map = L.mapbox.map('map-one', 'mapbox.streets').locate();
    Geolocation.getCurrentPosition().then((resp) => {
      map.setView([resp.coords.latitude, resp.coords.longitude], 14);


});

  }
}
