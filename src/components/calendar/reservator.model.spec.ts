import {
  Event,
  Room,
  Reservator
} from './index';

describe('components/calendar: Reservator', () => {
  describe('Constructor', () => {
    beforeAll(() => {
      spyOn(Reservator.prototype, 'initReservableRooms');
    });

    it('should build a reservator object', () => {
      let reservator = new Reservator();
      expect(Reservator.prototype.initReservableRooms).toHaveBeenCalled();
    });
  });

  describe('Methods', () => {
    let reservator;

    beforeEach(() => {
      reservator = new Reservator();
    });

    describe('initReservableRooms', () => {
      it('should build a reservator object', () => {
        reservator.initReservableRooms();
        expect(reservator.getRooms().length).toEqual(6);
      });
    });

    describe('setRoomsEvents', () => {
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
      });

      it('should set events for each room', () => {
        reservator.setRoomsEvents(fakeEventList.items);
        expect(reservator.getRooms().length).toEqual(6);
        let roomFormation = reservator.getRooms().find(room => room.name === 'Salle Formation (4e)');
        expect(roomFormation.events.length).toEqual(1);
        let roomProjecteur = reservator.getRooms().find(room => room.name === 'Visio projecteur (4e)');
        expect(roomProjecteur.events.length).toEqual(1);
      });
    });
  });
});
