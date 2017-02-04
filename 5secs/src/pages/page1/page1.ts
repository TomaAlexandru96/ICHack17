import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native'
import { NavController } from 'ionic-angular';

declare var L;
var map;
var coordinates;
var currentMarker = undefined;

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  main = "map";

  constructor(public navCtrl: NavController) {

  }

  ngAfterViewInit() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZmFuZ3lpIiwiYSI6ImNpeXI5dXBuZzAwMGszM3FudTQ3bG9tcDQifQ.25ONADCYigEjnEHUo0pRWg';
    map = L.mapbox.map('map-one', 'mapbox.streets', {zoomControl: false}).locate();
    Geolocation.getCurrentPosition().then((resp) => {
      map.setView([resp.coords.latitude, resp.coords.longitude], 14);
      coordinates =  [
        resp.coords.latitude,
        resp.coords.longitude
      ];
      L.marker(coordinates).addTo(map); // What if you move?
    });


    // On click event
    map.on('click', (e) => {
      if (currentMarker === undefined) {
        currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      } else {
        currentMarker.setLatLng(e.latlng);
        currentMarker.update();
      }
    });
  }

  positionMe() {
    map.setView(coordinates, 14);
  }

  getItems($event) {
  }

}
