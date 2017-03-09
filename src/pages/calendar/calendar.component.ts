import { Component } from '@angular/core';
import { Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home.component';
import {
  GoogleService,
  CalendarService
} from '../../services/index';
import {
  Room,
  Reservator
} from '../../components/calendar/index';
import { SuperDate } from '../../utilities/SuperDate';
import {
  RESPONSE_CODES,
  CALENDAR_STATUS
} from '../../config/return-codes.config';
import {
  CURRENT_ENVIRONMENT,
  ENVIRONMENT_DEVELOPMENT,
  ENVIRONMENT_PRODUCTION,
  CALENDAR_DEV_MIN_DATE
} from '../../config/app.config';

// TO DELETE
import { RESERVABLE_ROOMS } from '../../config/app.config';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.component.html'
})
export class CalendarPage {
  public loading: boolean;
  private authenticated: boolean;
  private userCalendar: any;
  private rooms: Room[];
  private reservator: Reservator;

  constructor(
    private nav: Nav,
    private navParams: NavParams,
    private googleService: GoogleService,
  	private calendarService: CalendarService 
  ) {
    this.loading = true;
    this.authenticated = false;
    this.reservator = new Reservator();
  }

  ionViewWillEnter() {
    if (this.navParams.get('loading') !== undefined) {
      this.loading = this.navParams.get('loading');
      this.rooms = this.navParams.get('rooms');
    }

    this.subscribeGoogleService();
    this.subcribeCalendarService();
    if (this.loading) this.googleService.checkToken();
  }

  getGoogleService() {
    return this.googleService;
  }

  getCalendarService() {
    return this.calendarService;
  }

  isAuthenticated() {
    return this.authenticated;
  }

  isLoading() {
    return this.loading;
  }

  getRooms() {
    return this.rooms;
  }

  setRooms(rooms: Room[]) {
    this.rooms = rooms;
  }

  getUserCalendar() {
    return this.userCalendar;
  }

  setUserCalendar(calendar: any) {
    this.userCalendar = calendar;
  }

  subscribeGoogleService() {
    this.googleService.getStatus().subscribe(data => this.treatGoogleServiceData(data));
  }

  subcribeCalendarService() {
    this.calendarService.getStatus().subscribe(data => this.treatCalendarServiceData(data));
  }

  treatGoogleServiceData(data: any) {
    if (data === RESPONSE_CODES.TOKEN_CHECKED) {
      if (!this.googleService.isAuthenticated) {
        this.authenticated = false;
        this.googleService.getAuthorization();
      } else {
        this.authenticated = true;
        this.googleService.getToken().then(token => {
          this.calendarService.setToken(token);
          this.calendarService.getAllCalendars();
        });
      }
    }
  }

  treatCalendarServiceData(data: any) {
    switch (data) {
      case CALENDAR_STATUS.GOT_ALL:
        this.retrieveUserCalendar(this.calendarService.getData());
        break;
      case CALENDAR_STATUS.GOT_EVENTS:
        this.getRoomsReservationsAndRefreshPage(this.calendarService.getData().items);
        break;
    }
  }

  retrieveUserCalendar(calendarList: any) {
    if (calendarList.items) {
      this.setUserCalendar(calendarList.items.find(calendar => !calendar.id.match(/google\.com/)));
      this.getUserCalendarEvents();
    }
  }

  getUserCalendarEvents() {
    let minDate = new SuperDate();
    if (CURRENT_ENVIRONMENT === ENVIRONMENT_DEVELOPMENT) minDate = CALENDAR_DEV_MIN_DATE;
    let maxDate = minDate.getNextDay();
    this.calendarService.getAllEventsOfCalendar(this.userCalendar.id, {timeMin: minDate.toISOString(), timeMax: maxDate.toISOString() });
  }

  getRoomsReservationsAndRefreshPage(calendarEvents: any) {
    this.reservator.setRoomsEvents(calendarEvents);
    this.rooms = this.reservator.getRooms();
    this.loading = false;
    this.nav.setRoot(CalendarPage, { loading: false, rooms: this.rooms });
  }

  disconnect() {
    this.googleService.deleteToken().then(() => {
      this.nav.setRoot(HomePage);
    });
  }
}
