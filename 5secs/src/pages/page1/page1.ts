import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native'
import { NavController } from 'ionic-angular';

declare var L;
var map;
var coordinates;

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZmFuZ3lpIiwiYSI6ImNpeXI5dXBuZzAwMGszM3FudTQ3bG9tcDQifQ.25ONADCYigEjnEHUo0pRWg';
    map = L.mapbox.map('map-one', 'mapbox.streets').locate();
    Geolocation.getCurrentPosition().then((resp) => {
      map.setView([resp.coords.latitude, resp.coords.longitude], 14);

      coordinates =  [
        resp.coords.latitude,
        resp.coords.longitude
      ];
      L.marker(coordinates).addTo(map);
    });
  }

  positionMe() {
    map.setView(coordinates, 14);
  }

}
