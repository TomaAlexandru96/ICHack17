import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native'
import { NavController } from 'ionic-angular';
import { HTTP } from 'ionic-native';
import { EventCreationPage } from '../event_creation/event_creation';
import { Page2 } from '../page2/page2';

declare var L;

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  map;
  coordinates;
  geocoder;
  currentMarker = undefined;
  eventJSON;
  layer;
  eventMarkers = [];
  main = "map";
  searchedItems = [];

  // icons
  userIcon = L.icon({
    iconUrl: 'assets/marker-user.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  currentIcon = L.icon({
    iconUrl: 'assets/marker-current.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(public navCtrl: NavController) {
  }

  ngAfterViewInit() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZmFuZ3lpIiwiYSI6ImNpeXI5dXBuZzAwMGszM3FudTQ3bG9tcDQifQ.25ONADCYigEjnEHUo0pRWg';
    this.map = L.mapbox.map('map-one', 'mapbox.streets', {zoomControl: false}).locate();
    this.geocoder = L.mapbox.geocoder('mapbox.places');

    Geolocation.getCurrentPosition().then((resp) => {
      this.map.setView([resp.coords.latitude, resp.coords.longitude], 14);
      this.coordinates =  [
        resp.coords.latitude,
        resp.coords.longitude
      ];
      //this.layer = L.mapbox.featureLayer().setGeoJSON(this.userJson).addTo(this.map);
      L.marker(this.coordinates, {icon: this.userIcon}).addTo(this.map); // What if you move?
      this.refresh();
    }).catch((error) => {
      console.log('Error getting location', error);
    });

      // mostly demo reasons, we don't want things to fail even at worst case at demo
      this.eventJSON =
        [{
          id: 1,
          user_id: 845643595578874,
          "rate": null,
          "video": null,
          "description": "Hacks, memes, food",
          "longitude": -0.1770901679992676,
          "latitude": 51.4978767468778,
          "address": "7 Imperial College Rd, Kensington, London SW7 2AZ, UK",
          "title": "ICHACK17",
          "start_time": "2017-02-05T08:04:00Z",
          "end_time": "2017-02-05T09:04:00Z"
         },
         {
           id: 2,
           user_id: 845643595578874,
           "rate": null,
           "video": null,
           "description": "Come have fun at Union bar with the rest of the department!",
           "longitude": -0.17818450927734375,
           "latitude": 51.500368008689485,
           "address": "Prince Consort Road, Beit Hall, Kensington, London SW7 2AZ, UK",
           "title": "BAR NIGHT",
           "start_time": "2017-02-05T08:04:00Z",
           "end_time": "2017-02-05T09:04:00Z"
          },
         {
           id: 3,
           user_id: 845643595578874,
           "rate": null,
           "video": null,
           "description": "Come have fun at Union bar with the rest of the department!",
           "longitude": -0.17942905426025388,
           "latitude": 51.49875170957007,
           "address": "Huxley,  South Kensington, London SW7 2AZ, UK",
           "title": "COMPUTER LABS",
           "start_time": "2017-02-05T08:04:00Z",
           "end_time": "2017-02-05T09:04:00Z"
         }];

    // plot them
    this.plot();
    // On click event
    this.map.on('click', (e) => {
      (document.activeElement as any).blur();
      if (this.currentMarker === undefined) {
        this.currentMarker = L.marker([e.latlng.lat, e.latlng.lng], {icon: this.currentIcon}).addTo(this.map);
      } else {
        this.currentMarker.setLatLng(e.latlng);
        this.currentMarker.update();
      }
    });
  }

  refresh() {
    HTTP.get('http://13.74.168.159/events?longitude=' + this.coordinates[1]
                          + "&latitude=" + this.coordinates[0] + "&radius=2",
            {}, {})
        .then((response) => {
          this.eventJSON = JSON.parse(response.data);
          this.plot();
        })
        .catch((err) => {
          console.error(err);
        });
  }

  plot() {
    this.eventMarkers = [];
    for (var e in this.eventJSON) {
      this.eventMarkers.push(L.marker([this.eventJSON[e].latitude, this.eventJSON[e].longitude]).addTo(this.map));
      this.eventMarkers[e].addEventListener('click',
                                            ((e) => { this.gotoEventPage(this.eventJSON[e]) }).bind(this, e),
                                            false);
    }
  }

  newEventCreation() {
    var e = this.currentMarker;
    if (e == undefined) {
      return;
    }

    HTTP.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + e.getLatLng().lat + "," + e.getLatLng().lng, {}, {})
    .then((address) => {
      address = JSON.parse(address.data).results[0].formatted_address;

      // e.latlng.lat, e.latlng.lng, address
      this.navCtrl.push(EventCreationPage, {
        return: this,
        address: address,
        latitude: e.getLatLng().lat,
        longitude: e.getLatLng().lng
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  gotoEventPage(e) {
    this.navCtrl.push(Page2, e);
  }

  positionMe() {
    this.map.setView(this.coordinates, 14);
  }

  getItems($event) {
    console.log($event.target.value);
    if (this.geocoder !== undefined) {
      this.geocoder.query($event.target.value, ((err, data) => {this.showMap(err, data)} ).bind(this));
    }
  }

  showMap(err, data) {
    this.searchedItems = [];
    if (data === undefined || !data.hasOwnProperty('results')) {
      return;
    }
    for (var x in data.results.features) {
      this.searchedItems.push({name: data.results.features[x].place_name});
    }
  }

  // we search twice.. we are running out of time
  goto(loc) {
    console.log(loc);
    if (this.geocoder !== undefined) {
      this.geocoder.query(loc, ((err, data) => {this.goto2(err, data)} ).bind(this));
      this.searchedItems = [];
    }
  }
  goto2(err, data) {
    if (data.lbounds) {
        this.map.fitBounds(data.lbounds);
    } else if (data.latlng) {
        this.map.setView([data.latlng[0], data.latlng[1]], 13);
    }
  }
}
