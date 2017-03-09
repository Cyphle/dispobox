import { Component, OnInit } from '@angular/core';
import { Nav, NavParams } from 'ionic-angular';
import { DataService } from '../../services/index';
import {
  Floor,
  Box,
  Building
} from '../../components/box/index';
import { RESPONSE_CODES } from '../../config/return-codes.config';
import { DEFAULT_FLOOR_NUMBER } from '../../config/app.config';

@Component({
  selector: 'page-floor',
  templateUrl: 'floor.component.html',
})
export class FloorPage implements OnInit {
  public floorNumber: number;
  public floors: any;
  public floorData: any;
  public floorsDifferentFromCurrent: any;
  private defaultFloor: boolean;
  private building: Building;

  constructor(
    private nav: Nav,
    private navParams: NavParams,
    private dataService: DataService
  ) {
    this.building = new Building();

    this.floorNumber = navParams.get('floor');
    if (this.floorNumber !== undefined) {
      this.defaultFloor = false;
    } else {
      this.floorNumber = DEFAULT_FLOOR_NUMBER;
      this.defaultFloor = true;
    }
  }

  isDefaultFloor() {
    return this.defaultFloor;
  }

  setDefaultFloor(def: boolean) {
    this.defaultFloor = def;
  }

  getDataService() {
    return this.dataService;
  }

  ngOnInit() {
    this.subscribeDataService();
  }

  ionViewWillEnter() {
    this.getFloorData(false);
  }

  doRefresh(refresher) {
    this.getFloorData(true);
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  subscribeDataService() {
    this.dataService.status.subscribe(status => {
      if (status === RESPONSE_CODES.READY) {
        this.fetchData(this.dataService.getData());
      }
    });
  }

  fetchData(data: any) {
    this.building.setBoxesAndFloors(data);
    this.floors = this.building.getFloors();
    this.floorsDifferentFromCurrent = this.floors.filter(floor => floor.floorNumber !== this.floorNumber);
    this.floorData = this.building.getBoxesOfFloor(this.floorNumber);
  }

  getFloorData(doRefresh: boolean) {
    this.dataService.getBoxesData(doRefresh ? doRefresh : false);
  }

  goToFloor(floorNumber: number) {
    this.nav.setRoot(FloorPage, { floor: floorNumber, floors: this.floors });
  }
}
