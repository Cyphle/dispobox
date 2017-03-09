import { Component, OnInit } from '@angular/core';
import { Nav } from 'ionic-angular';
import { Building } from '../../components/box/index';
import { DataService } from '../../services/data.service';
import { FloorPage } from '../floor/floor.component';
import { CalendarPage } from '../calendar/calendar.component';
import { RESPONSE_CODES } from '../../config/return-codes.config';

@Component({
  selector: 'page-home',
  templateUrl: 'home.component.html'
})
export class HomePage implements OnInit {
  public floors;
  private allOccupied: boolean;
  private building: Building;

  constructor(
    public nav: Nav,
    private dataService: DataService
  ) {
    this.building = new Building();
    this.allOccupied = true;
  }

  ngOnInit() {
    this.subscribeDataService();
  }

  ionViewWillEnter() {
    this.getFloors(false);
  }

  areAllOccupied() {
    return this.allOccupied;
  }

  getDataService() {
    return this.dataService;
  }

  /*
   * Methods that call service to get data
   */

  doRefresh(refresher) {
    this.floors = [];
    this.getFloors(true);
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getFloors(doRefresh: boolean) {
    this.dataService.getBoxesData(doRefresh ? doRefresh : false);
  }

  /*
   * Methods that subscribe to service
   */

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
    this.allOccupied = this.building.areAllBoxesOccupied();
  }

  /*
   * Page navigation methods
   */

  goToFloor(floorNumber: number) {
    this.nav.setRoot(FloorPage, { floor: floorNumber });
  }

  goToCalendar() {
    this.nav.setRoot(CalendarPage);
  }
}
