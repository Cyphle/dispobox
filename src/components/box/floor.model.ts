'use strict';

export class Floor {
  constructor(
    public floorNumber?: number,
    public numberAvailableBoxes?: number,
    public numberTotalBoxes?: number
  ) {
    this.numberAvailableBoxes = 0;
    this.numberTotalBoxes = 0;
  }
}