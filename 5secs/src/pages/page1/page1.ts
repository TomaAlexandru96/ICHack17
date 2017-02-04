import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native'
import { NavController } from 'ionic-angular';
import { HTTP } from 'ionic-native';

declare var L;
var map;
var coordinates;
var currentMarker = undefined;
var eventJSON;
var eventMarkers = [];

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
      // get all events in radius 1km
      try {
        //events = HTTP.post('server', {coordinates}, {});
      } finally {
        // mostly demo reasons, we don't want things to fail even at worst case at demo
        eventJSON =
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
      for (var e in eventJSON) {
        eventMarkers.push(L.marker([eventJSON[e].lat, eventJSON[e].lng]).addTo(map));
        eventMarkers[e].addEventListener('click', ((e) => {this.gotoEventPage(eventJSON[e])}).bind(this, e), false);
      }

    });

    // On click event
    map.on('click', (e) => {
      if (currentMarker === undefined) {
        currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      } else {
        currentMarker.setLatLng(e.latlng);
        console.log(e.latlng);
        currentMarker.update();
      }
    });
  }


  gotoEventPage(e) {
    console.log(e);
    // goto event's page without destroying the map
  }

  positionMe() {
    map.setView(coordinates, 14);
  }

}
