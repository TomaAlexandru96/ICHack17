import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native'
import { NavController } from 'ionic-angular';

declare var L;
var map;
var coordinates;
var currentMarker = undefined;
var currentJson;

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
      L.marker(coordinates).addTo(map); // What if you move?

    });


    // On click event
    map.on('click', (e) => {
      if (currentMarker === undefined) {
        currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      } else {
        currentMarker.coordinates = [e.latlng.lat, e.latlng.lng];
        currentMarker.update();
      }
      console.log(currentJson.geometry.coordinates);
      var myLayer = L.mapbox.featureLayer().setGeoJSON(currentJson).addTo(map);
      map.scrollWheelZoom.disable();
    });
  }

  positionMe() {
    map.setView(coordinates, 14);
  }

}
