'use strict';

import { SuperDate } from '../../utilities/SuperDate';

export class Event {
  constructor(
    public summary?: string,
    public location?: string,
    public start?: SuperDate,
    public end?: SuperDate,
    public startTime?: string,
    public endTime?: string
  ) {
  	this.startTime = this.start.getTime();
    this.endTime = this.end.getTime();
  }
}