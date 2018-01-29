import { Component, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { InAppBrowser, InAppBrowserObject } from "@ionic-native/in-app-browser";
import { Geolocation } from "@ionic-native/geolocation";
import "rxjs/add/operator/throttleTime";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  browser: InAppBrowserObject;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    private iab: InAppBrowser
  ) {}

  ngOnInit(): void {
    this.browser = this.iab.create(
      "http://locusmap-test.singlehtml.com/",
      "_self",
      "EnableViewPortScale=yes,closebuttoncaption=Done"
    );
    this.browser
      .on("loadstop")
      .subscribe(
        _ => this.initTrackingCurrentLocation(),
        error => console.log(error)
      );
    // this.browser.on("loadstart").subscribe(
    //   test => {
    //     console.log("loadstart");
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
    this.browser.on("exit").subscribe(
      test => {
        console.log("exit");
      },
      error => {
        console.log(error);
      }
    );
  }

  initTrackingCurrentLocation() {
    var initalLat = 51.468999;
    var initialLng = -0.450903;
    var offsetCoordsLat;
    var offsetCoordsLng;

    const context = this;

    setTimeout(() => {
      context.geolocation
        .watchPosition({
          timeout: 30000,
          enableHighAccuracy: true
        })
        .throttleTime(500)
        // .filter(coords => coords.coords.accuracy < 200)
        .map(coords => {
          console.log("despues del filtro: ", coords);
          let newCoords;
          if (!offsetCoordsLat || !offsetCoordsLat) {
            newCoords = {
              latitude: initalLat,
              longitude: initialLng
            };
          } else {
            newCoords = {
              latitude: initalLat + (coords.coords.latitude - offsetCoordsLat),
              longitude:
                initialLng + (coords.coords.longitude - offsetCoordsLng)
            };
          }
          offsetCoordsLat = coords.coords.latitude;
          offsetCoordsLng = coords.coords.longitude;

          initalLat = newCoords.latitude;
          initialLng = newCoords.longitude;

          return newCoords;
        })
        .subscribe(coords => {
          const codeToExecute = `LocusMaps({command:"setPosition", lat:"${
            coords.latitude
          }", lng:"${coords.longitude}", timeout:0})`;

          context.browser.executeScript({
            code: codeToExecute
          });
        });
    }, 10000);
  }
}
