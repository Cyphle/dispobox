'use strict';

import { Event } from './event.model';

export class Room {
  constructor(
    public name?: string,
    public events?: Event[],
  ) {}
}