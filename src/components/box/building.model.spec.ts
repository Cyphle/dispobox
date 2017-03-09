import {
  Box,
  Floor
} from './index';
import { Building } from './building.model';
import { RESPONSE_CODES } from '../../config/return-codes.config';
import { 
  STATUS_AVAILABLE_BOX,
  EXCLUDED_FLOOR_NUMBER
} from '../../config/app.config';
import { mockData, mockDataNoFree } from '../../assets/mock.data';

describe('components/box: Building', () => {
  describe('Constructor', () => {
    it('should build a building', () => {
      let building = new Building();
      expect(building.getBoxes().length).toEqual(0);
      expect(building.getFloors().length).toEqual(0);
    });
  });

  describe('Methods', () => {
  	let building;

	  beforeEach(() => {
	    building = new Building();
	  });

    describe('setBoxesAndFloors', () => {
      beforeEach(() => {
        spyOn(Building.prototype, 'setBoxesFromJSONData');
        spyOn(Building.prototype, 'setFloorsFromBoxes');
      });

      it('should set boxes and floors', () => {
        building.setBoxesAndFloors(mockData.data);
        expect(Building.prototype.setBoxesFromJSONData).toHaveBeenCalled();
        expect(Building.prototype.setFloorsFromBoxes).toHaveBeenCalled();
      });
    });

	  describe('setBoxesFromJSONData', () => {
	    it('should map data and set boxes property and notify observers that it is ready', () => {
	      building.setBoxesFromJSONData(mockData.data);
	      expect(building.getBoxes().length).toEqual(15);
	    });
	  });

	  describe('isRealFloor', () => {
	    it('should get true if floor is not 0 (not in EXCLUDED_FLOOR_NUMBER)', () => {
	      expect(building.isRealFloor('43')).toBe(true);
	    });

	    it('should get false if floor is 0 (in EXCLUDED_FLOOR_NUMBER)', () => {
	      expect(building.isRealFloor('0')).toBe(false);
	    });
	  });

	  describe('retrieveFloorsFromBoxes', () => {
	    beforeEach(() => {
	      let boxes = mockData.data.filter(jsonBox => {
                      let floorNumber = parseInt(jsonBox.id, 10);
                      let isRealFloor = EXCLUDED_FLOOR_NUMBER.find(excludedFloor => excludedFloor === floorNumber);
                      return isRealFloor === undefined ? true : false;
                    })
                    .map(box => new Box(box.id, box.state, box.name));
				building.setBoxes(boxes);
	      spyOn(Building.prototype, 'setAvailableBoxesAndNumberOfBoxesOfFloors');
	    });

	    it('should return set existing floors', () => {
	      building.setFloorsFromBoxes();
	      expect(building.getFloors().length).toEqual(2);
	      expect(building.getFloors()[0].floorNumber).toEqual(4);
	      expect(building.getFloors()[1].floorNumber).toEqual(6);
        expect(Building.prototype.setAvailableBoxesAndNumberOfBoxesOfFloors).toHaveBeenCalled();
	    });
	  });

    describe('setAvailableBoxesAndNumberOfBoxesOfFloors', () => {
      let floors = [];

      beforeEach(() => {
        let boxes = mockData.data.filter(jsonBox => {
                      let floorNumber = parseInt(jsonBox.id, 10);
                      let isRealFloor = EXCLUDED_FLOOR_NUMBER.find(excludedFloor => excludedFloor === floorNumber);
                      return isRealFloor === undefined ? true : false;
                    })
                    .map(box => new Box(box.id, box.state, box.name));
        building.setBoxes(boxes);

        let floors = boxes.map(box => new Floor(Math.floor(box.name/10), 0, 0))
                          .filter((floor, index, self) => index === self.findIndex(selfFloor => selfFloor.floorNumber === floor.floorNumber));
        building.setFloors(floors);
      });

      it('should count available and total boxes by floor', () => {
        building.setAvailableBoxesAndNumberOfBoxesOfFloors(floors);
        expect(building.getFloors()[0].numberAvailableBoxes).toEqual(1);
        expect(building.getFloors()[0].numberTotalBoxes).toEqual(7);
        expect(building.getFloors()[1].numberAvailableBoxes).toEqual(2);
        expect(building.getFloors()[1].numberTotalBoxes).toEqual(8);
      });
    });

    describe('getBoxesOfFloor', () => {
      beforeEach(() => {
        building.setBoxesAndFloors(mockData.data);
      });

      it('should retrieve floor data', () => {
        let floorBoxes = building.getBoxesOfFloor(4);
        expect(floorBoxes.length).toEqual(7);
      });
    });

    describe('areAllBoxesOccupied', () => {
      it('should retrieve get true when all boxes are occupied', () => {
        building.setBoxesAndFloors(mockDataNoFree.data);
        expect(building.areAllBoxesOccupied()).toBe(true);
      });

      it('should retrieve get false when all boxes are not occupied', () => {
        building.setBoxesAndFloors(mockData.data);
        expect(building.areAllBoxesOccupied()).toBe(false);
      });
    });
  });
});
