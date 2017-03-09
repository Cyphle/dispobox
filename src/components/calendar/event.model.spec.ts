import { SuperDate } from '../../utilities/SuperDate';
import { Event } from './event.model';

describe('components/calendar: Event', () => {
	it('should set start time and end time while constructing', () => {
		let event = new Event('Summary', 'Location', new SuperDate(new Date(2017, 1, 17, 8, 30)), new SuperDate(new Date(2017, 1, 18, 10, 30)));
		expect(event.startTime).toEqual('08h30');
		expect(event.endTime).toEqual('10h30');
	});
});