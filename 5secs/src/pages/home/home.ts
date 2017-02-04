import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

declare var L;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {


  }

  ngOnInit() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZmFuZ3lpIiwiYSI6ImNpeXI5dXBuZzAwMGszM3FudTQ3bG9tcDQifQ.25ONADCYigEjnEHUo0pRWg';
    L.mapbox.map('map-one', 'mapbox.streets').setView([38.8929, -77.0252], 14);  
  }

}
