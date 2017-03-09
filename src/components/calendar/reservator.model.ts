import { RESERVABLE_ROOMS } from '../../config/app.config';
import { Event, Room } from './index';
import { SuperDate } from '../../utilities/SuperDate';

export class Reservator {
	private rooms: Room[];

	constructor() {
		this.rooms = [];
		this.initReservableRooms();
	}

	getRooms() {
		return this.rooms;
	}

	initReservableRooms() {
    this.rooms = [];
    this.rooms = RESERVABLE_ROOMS.map(reservableRoom => {
      return new Room(reservableRoom, []);
    });
  }

  setRoomsEvents(events: any) {
  	this.rooms = this.rooms.map(room => {
  		room.events = events.map(event => new Event(event.summary, event.location, new SuperDate(event.start.dateTime), new SuperDate(event.end.dateTime)))
  													.filter(event => event.location === room.name);
			 return room;
  	});
  }
}
