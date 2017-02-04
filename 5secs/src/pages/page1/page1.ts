import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native'
import { NavController } from 'ionic-angular';
import { HTTP } from 'ionic-native';

declare var L;
/*
var currentJson =
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-77.031952, 38.913184]
    },
    properties: {
      'marker-color': '#ffa0d3',
      'marker-size': 'large',
    }
  };
var userJson =
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.031952, 38.913184]
      },
      properties: {
        'marker-color': '#00ff0d3',
        'marker-size': 'large',
      }
    };
var eventJson =
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.031952, 38.913184]
        },
        properties: {
          'marker-color': '#00f6ff',
          'marker-size': 'large',
        }
      };*/


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  map;
  coordinates;
  currentMarker = undefined;
  eventJSON;
  eventMarkers = [];
  main = "map";

  constructor(public navCtrl: NavController) {

  }

  ngAfterViewInit() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZmFuZ3lpIiwiYSI6ImNpeXI5dXBuZzAwMGszM3FudTQ3bG9tcDQifQ.25ONADCYigEjnEHUo0pRWg';
    this.map = L.mapbox.map('map-one', 'mapbox.streets', {zoomControl: false}).locate();
    Geolocation.getCurrentPosition().then((resp) => {
      this.map.setView([resp.coords.latitude, resp.coords.longitude], 14);
      this.coordinates =  [
        resp.coords.latitude,
        resp.coords.longitude
      ];
      L.marker(this.coordinates).addTo(this.map); // What if you move?

      // get all events in radius 1km
      try {
        //events = HTTP.post('server', {coordinates}, {});
      } finally {
        // mostly demo reasons, we don't want things to fail even at worst case at demo
        this.eventJSON =
          [{
            name: "IC HACK",
            lat: 51.49868324935443,
            lng: -0.1772511005401611
           },
           {
             name: "UNION BAR",
             lat: 51.500368008689485,
             lng: -0.17818450927734375
           },
           {
              name: "COMPUTER LABS",
              lat: 51.49875170957007,
              lng: -0.17942905426025388
           }];
      }
      // plot them
      for (var e in this.eventJSON) {
        this.eventMarkers.push(L.marker([this.eventJSON[e].lat, this.eventJSON[e].lng]).addTo(this.map));
        this.eventMarkers[e].addEventListener('click', ((e) => {this.gotoEventPage(this.eventJSON[e])}).bind(this, e), false);
      }

    });

    // On click event
    this.map.on('click', (e) => {
      (document.activeElement as any).blur();
      if (this.currentMarker === undefined) {
        this.currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      } else {
        this.currentMarker.setLatLng(e.latlng);
        console.log(e.latlng);
        this.currentMarker.update();
      }
    });
  }


  gotoEventPage(e) {
    console.log(e);
    // goto event's page without destroying the map
  }

  positionMe() {
    this.map.setView(this.coordinates, 14);
  }

  getItems($event) {
  }

}
