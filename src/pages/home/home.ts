import { Component, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { InAppBrowser } from "@ionic-native/in-app-browser";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  constructor(
    public navCtrl: NavController,
    private permission: AndroidPermissions,
    private iab: InAppBrowser
  ) {}

  ngOnInit(): void {
    this.permission.requestPermission(
      this.permission.PERMISSION.ACCESS_FINE_LOCATION
    );

    this.iab.create("assets/map/map.html", "_self");
  }
}
