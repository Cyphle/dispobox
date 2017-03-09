import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { SuperDate } from './SuperDate';

describe('Utilities: SuperDate', () => {
	describe('Constructor', () => {
		it('should build date from date object', () => {
			let superDate = new SuperDate(new Date(2017, 1, 17,));
			expect(superDate.getDate().year()).toEqual(2017);
			expect(superDate.getDate().month()).toEqual(1);
			expect(superDate.getDate().date()).toEqual(17);
		});

		it('should build date from string date YYYY-MM-DD', () => {
			let superDate = new SuperDate('2017-02-17');
			expect(superDate.getDate().year()).toEqual(2017);
			expect(superDate.getDate().month()).toEqual(1);
			expect(superDate.getDate().date()).toEqual(17);
		});

		it('should build date from string ISO date', () => {
			let superDate = new SuperDate('2017-02-16T23:00:00.000Z');
			expect(superDate.getDate().year()).toEqual(2017);
			expect(superDate.getDate().month()).toEqual(1);
			expect(superDate.getDate().date()).toEqual(17);
		});
	});

	describe('Methods', () => {
		let superDate;

		beforeAll(() => {
			superDate = new SuperDate();
		});

		it('should set super date from date object', () => {
			let dateObject = new Date(2017, 1, 17);
			superDate.setDateFromDateObject(dateObject);
			expect(superDate.getDate().year()).toEqual(2017);
			expect(superDate.getDate().month()).toEqual(1);
			expect(superDate.getDate().date()).toEqual(17);
		});

		it('should set super date from date string', () => {
			superDate.setDateFromString('2017-02-17');
			expect(superDate.getDate().year()).toEqual(2017);
			expect(superDate.getDate().month()).toEqual(1);
			expect(superDate.getDate().date()).toEqual(17);
		});

		it('should get date in ISO format', () => {
			let dateObject = new Date(2017, 1, 17);
			superDate.setDateFromDateObject(dateObject);
			expect(superDate.getDate().toISOString()).toEqual('2017-02-16T23:00:00.000Z');
		});

		it('should set to next day of given date', () => {
			let dateObject = new Date(2017, 1, 17);
			superDate.setDateFromDateObject(dateObject);
			superDate.setToTomorrow();
			expect(superDate.getDate().year()).toEqual(2017);
			expect(superDate.getDate().month()).toEqual(1);
			expect(superDate.getDate().date()).toEqual(18);
		});

		it('should get next day', () => {
			let dateObject = new Date(2017, 1, 17);
			superDate.setDateFromDateObject(dateObject);
			let nextDay = superDate.getNextDay();
			expect(superDate.getDate().year()).toEqual(2017);
			expect(superDate.getDate().month()).toEqual(1);
			expect(superDate.getDate().date()).toEqual(17);
			expect(nextDay.getDate().year()).toEqual(2017);
			expect(nextDay.getDate().month()).toEqual(1);
			expect(nextDay.getDate().date()).toEqual(18);
		});

		it('should get time in HHhmm format', () => {
			let dateObject = new Date(2017, 1, 17, 10, 30);
			superDate.setDateFromDateObject(dateObject);
			expect(superDate.getTime()).toEqual('10h30');
		});

		it('should get time in HHhmm format', () => {
			let dateObject = new Date(2017, 1, 17, 9, 30);
			superDate.setDateFromDateObject(dateObject);
			expect(superDate.getTime()).toEqual('09h30');
		});
	});
});