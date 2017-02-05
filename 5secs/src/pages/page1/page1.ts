import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native'
import { NavController } from 'ionic-angular';
import { HTTP } from 'ionic-native';

declare var L;

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  map;
  coordinates;
  currentMarker = undefined;
  eventJSON;
  layer;
  eventMarkers = [];
  main = "map";

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
    Geolocation.getCurrentPosition().then((resp) => {
      this.map.setView([resp.coords.latitude, resp.coords.longitude], 14);
      this.coordinates =  [
        resp.coords.latitude,
        resp.coords.longitude
      ];
      //this.layer = L.mapbox.featureLayer().setGeoJSON(this.userJson).addTo(this.map);
      L.marker(this.coordinates, {icon: this.userIcon}).addTo(this.map); // What if you move?

      // get all events in radius 1km
      try {
        this.eventJSON = HTTP.get('13.74.168.159/events/',
                                  {
                                    longitude: this.coordinates[0],
                                    latitude: this.coordinates[1],
                                    radius: 1
                                  },{});
        console.log(this.eventJSON);
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
        this.eventMarkers[e].addEventListener('click',
                                              ((e) => { this.gotoEventPage(this.eventJSON[e]) }).bind(this, e),
                                              false);
      }

    });

    // On click event
    this.map.on('click', (e) => {
      (document.activeElement as any).blur();
      if (this.currentMarker === undefined) {
        this.currentMarker = L.marker([e.latlng.lat, e.latlng.lng], {icon: this.currentIcon}).addTo(this.map);
        this.currentMarker.addEventListener('onclick',
                                            () => { this.newEventCreation(this.currentMarker) },
                                            false);
      } else {
        this.currentMarker.setLatLng(e.latlng);
        console.log(e.latlng);
        this.currentMarker.update();
      }

    });
  }

  newEventCreation(e) {
    // demo-safe
    var address;
    try {
      address = HTTP.get("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + e.latlng.lat + "," + e.latlng, {}, {});
      address = address.results[0].formatted_address
    } catch (err) {}
    // e.latlng.lat, e.latlng.lng, address
    console.log(e);
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
