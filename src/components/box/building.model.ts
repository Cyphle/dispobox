import {
  Box,
  Floor
} from './index';
import { 
  STATUS_AVAILABLE_BOX,
  EXCLUDED_FLOOR_NUMBER
} from '../../config/app.config';

export class Building {
  private boxes: Box[];
  private floors: Floor[];

  constructor() {
    this.boxes = [];
    this.floors = [];
  }

  getBoxes() {
    return this.boxes;
  }

  setBoxes(boxes: Box[]) {
    this.boxes = boxes;
  }

  getFloors() {
    return this.floors;
  }

  setFloors(floors: Floor[]) {
    this.floors = floors;
  }

  getBoxesOfFloor(floorNumber: number) {
    return this.boxes.filter(box => floorNumber === Math.floor(box.name/10));
  }

  setBoxesAndFloors(data: any) {
    this.setBoxesFromJSONData(data);
    this.setFloorsFromBoxes();
  }

  setBoxesFromJSONData(data: any) {
    this.boxes = data.filter(jsonBox => this.isRealFloor(jsonBox.id))
                    .map(box => new Box(box.id, box.state, box.name));
  }

  isRealFloor(floor: any) {
    let floorNumber = parseInt(floor, 10);
    let isRealFloor = EXCLUDED_FLOOR_NUMBER.find(excludedFloor => excludedFloor === floorNumber);
    return isRealFloor === undefined ? true : false;
  }

  setFloorsFromBoxes() {
    this.floors = this.boxes.map(box => new Floor(Math.floor(box.name/10), 0, 0))
                          .filter((floor, index, self) => index === self.findIndex(selfFloor => selfFloor.floorNumber === floor.floorNumber));
    this.setAvailableBoxesAndNumberOfBoxesOfFloors();
  }

  setAvailableBoxesAndNumberOfBoxesOfFloors() {
    this.floors = this.floors.map(floor => {
      let numberOfBoxes = this.boxes.filter(box => floor.floorNumber === Math.floor(box.name/10));
      floor.numberTotalBoxes = numberOfBoxes.length;
      
      let numberOfFreeBoxes = this.boxes.filter(box => {
        return floor.floorNumber === Math.floor(box.name/10) && box.state === STATUS_AVAILABLE_BOX;
      });
      floor.numberAvailableBoxes = numberOfFreeBoxes.length;
      
      return floor;
    });
  }

  areAllBoxesOccupied() {
    let floorWithAvailableRoom = this.floors.find(floor => floor.numberAvailableBoxes > 0);
    return floorWithAvailableRoom !== undefined ? false : true;
  }
}
