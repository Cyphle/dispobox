import { TestBed, inject, async } from '@angular/core/testing';
import { Component, Input, EventEmitter } from '@angular/core';
import { Nav, NavParams, IonicModule } from 'ionic-angular';
import { CalendarPage } from './calendar.component';
import { CalendarService } from '../../services/calendar.service';
import { GoogleService } from '../../services/google.service';
import { HTTPService } from '../../services/http.service';
import { SuperDate } from '../../utilities/SuperDate';
import {
  Event,
  Room
} from '../../components/calendar/index';
import {
  RESERVABLE_ROOMS,
  CALENDAR_DEV_MIN_DATE
} from '../../config/app.config';
import {
  RESPONSE_CODES,
  CALENDAR_STATUS
} from '../../config/return-codes.config';

class MockNavParams {
  static returnParam = {};

  public get(key): any {
    if (MockNavParams.returnParam) {
      return MockNavParams.returnParam[key];
    }
    return 'default';
  }

  static setParams(values) {
    for (let key in values) {
      MockNavParams.returnParam[key] = values[key];
    }
  }
}

class MockCalendarService extends CalendarService {
  constructor() {
    super(null, null);
  }

  sendGetRequest(path: string, status: number) {
    this.getStatus().emit(status);
  }

  setToken(token) { }

  getAllCalendars() { }

  getData() { return []; }

  getAllEventsOfCalendar() { }
}

class MockNav {
  setRoot(page: any, options?: any) { }
}

class MockGoogleService extends GoogleService {
  constructor() {
    super(null, new MockHTTPService());
  }

  treatHTTPServiceResponse(response: number) {
    this.getStatus().emit(RESPONSE_CODES.TOKEN_CHECKED);
  }

  getToken() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  deleteToken() { 
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

class MockHTTPService extends HTTPService {
  public fetched = new EventEmitter();

  constructor() {
    super(null);
  }
}

describe('Page: CalendarPage', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarPage
      ],
      imports: [
        IonicModule.forRoot(CalendarPage)
      ],
      providers: [
        { provide: Nav, useClass: MockNav },
        { provide: NavParams, useClass: MockNavParams },
        { provide: GoogleService, useClass: MockGoogleService },
        { provide: CalendarService, useClass: MockCalendarService }
      ]
    });
    TestBed.compileComponents();
  }));

  describe('Constructor', () => {
    it('should render projects component', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      fixture.detectChanges();
      const calendarComponent: CalendarPage = fixture.componentInstance;
      expect(calendarComponent).toBeTruthy();
    });
  });

  describe('ionViewWillEnter', () => {
    let rooms;

    beforeAll(() => {
      rooms = [];
      RESERVABLE_ROOMS.forEach(reservableRoom => {
        let room = new Room();
        room.name = reservableRoom;
        room.events = [];
        rooms.push(room);
      });
      spyOn(CalendarPage.prototype, 'subscribeGoogleService');
      spyOn(CalendarPage.prototype, 'subcribeCalendarService');
      spyOn(GoogleService.prototype, 'checkToken');
    });

    it('should init component when loading', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      fixture.detectChanges();
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.ionViewWillEnter();
      expect(calendarComponent.isLoading()).toBe(true);
      expect(CalendarPage.prototype.subscribeGoogleService).toHaveBeenCalled();
      expect(CalendarPage.prototype.subcribeCalendarService).toHaveBeenCalled();
      expect(GoogleService.prototype.checkToken).toHaveBeenCalled();
    });

    it('should init component when loaded is finished', () => {
      MockNavParams.setParams({ loading: false, rooms: rooms });
      const fixture = TestBed.createComponent(CalendarPage);
      fixture.detectChanges();
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.ionViewWillEnter();
      expect(calendarComponent.isLoading()).toBe(false);
      expect(calendarComponent.getRooms().length).toEqual(6);
      expect(CalendarPage.prototype.subscribeGoogleService).toHaveBeenCalled();
      expect(CalendarPage.prototype.subcribeCalendarService).toHaveBeenCalled();
    });
  });

  describe('subscribeGoogleService', () => {
    beforeAll(() => {
      spyOn(CalendarPage.prototype, 'treatGoogleServiceData');
    });

    it('should subscribe to google service', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.subscribeGoogleService();
      calendarComponent.getGoogleService().treatHTTPServiceResponse(RESPONSE_CODES.CHECK_TOKEN);
      expect(CalendarPage.prototype.treatGoogleServiceData).toHaveBeenCalled();
    });
  });

  describe('subcribeCalendarService', () => {
    beforeAll(() => {
      spyOn(CalendarPage.prototype, 'treatCalendarServiceData');
    });

    it('should subscribe to calendar service', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.subcribeCalendarService();
      calendarComponent.getCalendarService().sendGetRequest('', CALENDAR_STATUS.GOT_EVENTS);
      expect(CalendarPage.prototype.treatCalendarServiceData).toHaveBeenCalled();
    });
  });

  describe('treatGoogleServiceData', () => {
    beforeAll(() => {
      spyOn(GoogleService.prototype, 'getAuthorization');
      spyOn(MockGoogleService.prototype, 'getToken').and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });
    });

    it('should treat google service response when not authenticated', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.getGoogleService().isAuthenticated = false;
      calendarComponent.treatGoogleServiceData(RESPONSE_CODES.TOKEN_CHECKED);
      expect(calendarComponent.isAuthenticated()).toBe(false);
      expect(GoogleService.prototype.getAuthorization).toHaveBeenCalled();
    });

    it('should treat google service response when authenticated', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.getGoogleService().isAuthenticated = true;
      calendarComponent.treatGoogleServiceData(RESPONSE_CODES.TOKEN_CHECKED);
      expect(calendarComponent.isAuthenticated()).toBe(true);
      expect(MockGoogleService.prototype.getToken).toHaveBeenCalled();
    });
  });

  describe('treatCalendarServiceData', () => {
    beforeAll(() => {
      spyOn(CalendarPage.prototype, 'retrieveUserCalendar');
      spyOn(CalendarPage.prototype, 'getRoomsReservationsAndRefreshPage');
    });

    it('should treat calendar service response when got all calendars', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.treatCalendarServiceData(CALENDAR_STATUS.GOT_ALL);
      expect(CalendarPage.prototype.retrieveUserCalendar).toHaveBeenCalled();
    });

    it('should treat calendar service response when got events', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.treatCalendarServiceData(CALENDAR_STATUS.GOT_EVENTS);
      expect(CalendarPage.prototype.getRoomsReservationsAndRefreshPage).toHaveBeenCalled();
    });
  });

  describe('retrieveUserCalendar', () => {
    let fakeCalendarList: any;

    beforeAll(() => {
      fakeCalendarList = {  
         items: [
          { id: "testuser@extia.fr" },
          { id: "#contacts@group.v.calendar.google.com" },
          { id: "fr.french#holiday@group.v.calendar.google.com" },
          { id: "e_2_fr#weeknum@group.v.calendar.google.com" }
         ]
       };

       spyOn(CalendarPage.prototype, 'getUserCalendarEvents');
    });

    it('should retrieve the calendar of the current user by removing all google calendars', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.retrieveUserCalendar(fakeCalendarList);
      expect(calendarComponent.getUserCalendar().id).toEqual('testuser@extia.fr');
      expect(CalendarPage.prototype.getUserCalendarEvents).toHaveBeenCalled();
    });
  });

  describe('getUserCalendarEvents', () => {
    beforeAll(() => {
      spyOn(MockCalendarService.prototype, 'getAllEventsOfCalendar');
    });

    it('should call get event of calendar with right settings', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.setUserCalendar({ id: 'testuser@extia.fr' });
      calendarComponent.getUserCalendarEvents();
      let minDate = CALENDAR_DEV_MIN_DATE;
      let maxDate = minDate.getNextDay();
      expect(MockCalendarService.prototype.getAllEventsOfCalendar).toHaveBeenCalledWith('testuser@extia.fr', {timeMin: minDate.toISOString(), timeMax: maxDate.toISOString() });
    });
  });

  describe('getRoomsReservationsAndRefreshPage', () => {
    let fakeEventList: any;

    beforeAll(() => {
      fakeEventList = {
        items: [
          { "kind":"calendar#event", "etag":"\"2974469618276000\"", "id":"c9g6cdsfvt81qr5v6jkt6qjk58", "status":"confirmed", "htmlLink":"https://www.google.com/calendar/event?eid=YzlnNmNkc2Z2dDgxcXI1djZqa3Q2cWprNTggdGVzdHVzZXJAZXh0aWEuZnI", "created":"2017-02-16T08:46:20.000Z", "updated":"2017-02-16T08:46:49.138Z", "summary":"Test reservation salle", "location":"Salle Formation (4e)", "creator": { "email":"gpagis@extia.fr", "displayName":"Georges Pagis" }, "organizer":{   "email":"gpagis@extia.fr", "displayName":"Georges Pagis" }, "start":{   "dateTime":"2017-02-17T07:00:00+01:00" }, "end":{   "dateTime":"2017-02-17T08:00:00+01:00" }, "transparency":"transparent", "iCalUID":"c9g6cdsfvt81qr5v6jkt6qjk58@google.com", "sequence":1, "attendees":[  
                { "email":"testuser@extia.fr", "self":true, "responseStatus":"needsAction" },
                { "email":"extia.fr_3636313338393131383630@resource.calendar.google.com", "displayName":"Salle Formation (4e)", "resource":true, "responseStatus":"accepted" },
                { "email":"gpagis@extia.fr", "displayName":"Georges Pagis", "organizer":true, "responseStatus":"accepted" }], "hangoutLink":"https://plus.google.com/hangouts/_/extia.fr/gpagis?hceid=Z3BhZ2lzQGV4dGlhLmZy.c9g6cdsfvt81qr5v6jkt6qjk58", "reminders": { "useDefault":true }
          },
          { "kind":"calendar#event", "etag":"\"2974470054154000\"", "id":"5umn3566ai6f24uietre1ubrbc", "status":"confirmed", "htmlLink":"https://www.google.com/calendar/event?eid=NXVtbjM1NjZhaTZmMjR1aWV0cmUxdWJyYmMgdGVzdHVzZXJAZXh0aWEuZnI", "created":"2017-02-16T08:46:51.000Z", "updated":"2017-02-16T08:50:27.077Z", "summary":"Test reservation salle", "location":"Visio projecteur (4e)", "creator":{   "email":"gpagis@extia.fr", "displayName":"Georges Pagis" }, "organizer":{   "email":"gpagis@extia.fr", "displayName":"Georges Pagis" }, "start":{   "dateTime":"2017-02-17T07:00:00+01:00" }, "end":{   "dateTime":"2017-02-17T08:00:00+01:00" }, "transparency":"transparent", "iCalUID":"5umn3566ai6f24uietre1ubrbc@google.com", "sequence":1, "attendees":[  
                { "email":"gpagis@extia.fr", "displayName":"Georges Pagis", "organizer":true, "responseStatus":"accepted" },
                { "email":"testuser@extia.fr", "self":true, "responseStatus":"needsAction" },
                { "email":"extia.fr_3737393839373636373031@resource.calendar.google.com", "displayName":"Visio projecteur (4e)", "resource":true, "responseStatus":"accepted" }], "hangoutLink":"https://plus.google.com/hangouts/_/extia.fr/gpagis?hceid=Z3BhZ2lzQGV4dGlhLmZy.5umn3566ai6f24uietre1ubrbc", "reminders": { "useDefault":true }
          }
        ]
      };

      spyOn(MockNav.prototype, 'setRoot');
    });

    it('should call get event of calendar with right settings', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.getRoomsReservationsAndRefreshPage(fakeEventList.items);
      expect(calendarComponent.getRooms().length).toEqual(6);
      expect(calendarComponent.loading).toBe(false);
      expect(MockNav.prototype.setRoot).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    beforeAll(() => {
      spyOn(MockGoogleService.prototype, 'deleteToken').and.callFake(() => {
        return new Promise((resolve, reject) => { resolve() });
      });
    });

    it('should disconnect', () => {
      const fixture = TestBed.createComponent(CalendarPage);
      const calendarComponent: CalendarPage = fixture.componentInstance;
      calendarComponent.disconnect();
      expect(MockGoogleService.prototype.deleteToken).toHaveBeenCalled();
    });
  });
});
