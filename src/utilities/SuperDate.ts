import * as moment from 'moment';

export class SuperDate {
	private date;

	constructor(dateParam?: any) {
		if (dateParam !== undefined && dateParam !== null) {
			if (dateParam instanceof Date)
				this.setDateFromDateObject(dateParam);
			else if (typeof dateParam === 'string')
				this.setDateFromString(dateParam);
		}
		else
			this.date = moment();
	}

	getDate() {
		return this.date;
	}

	getTime() {
		return this.date.format('HH') + 'h' + this.date.format('mm');
	}

	setToTomorrow() {
		this.date.add(1, 'days');
	}

	getNextDay() {
		let tomorrow = moment(this.date.toISOString());
		tomorrow.add(1, 'days');
		let superTomorrow = new SuperDate(tomorrow.toISOString());
		return superTomorrow;
	}

	setDateFromDateObject(dateObject: Date) {
		this.date = moment(dateObject);
	}

	setDateFromString(dateString: string) {
		this.date = moment(dateString);
	}

	toISOString() {
		return this.date.toISOString();
	}
}