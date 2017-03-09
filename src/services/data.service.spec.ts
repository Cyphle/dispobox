import { EventEmitter } from '@angular/core';
import {
  TestBed,
  ComponentFixture,
  async
} from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { HTTPService } from './http.service';
import { DevHTTPService } from './dev-http.service';
import { DataService } from './data.service';
import {
  Box,
  Floor
} from '../components/box/index';
import { RESPONSE_CODES } from '../config/return-codes.config';
import { mockData, mockDataNoFree } from '../assets/mock.data';

class MockHTTPService extends HTTPService {
  public data = mockData;

  constructor() {
    super(null);
  }
}

class MockDevHTTPService extends DevHTTPService {
  public data = mockData;

  getAllBoxes() {
    return mockData;
  }
}

class MockEventEmitter<T> extends EventEmitter<T> {
  constructor() {
    super();
  }

  emit(event: any) {
    return event;
  }
}

describe('Service: DataService', () => {
  let service;

  beforeEach(() => {
    service = new DataService(new MockHTTPService(), new MockDevHTTPService());
  });

  describe('Constructor', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'subscribeHTTPService');
    });

    it('should build a service', () => {
      service = new DataService(new MockHTTPService(), new MockDevHTTPService());
      expect(service.getDataService() instanceof DevHTTPService).toBe(true);
      expect(DataService.prototype.subscribeHTTPService).toHaveBeenCalled();
    });
  });

  describe('treatFetchedData', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'notifyObservers');
    });

    it('should treat fetched data and call map data if return code is ok', () => {
      service.treatFetchedData(RESPONSE_CODES.OK);
      expect(service.getData().data.length).toEqual(16);
      expect(DataService.prototype.notifyObservers).toHaveBeenCalled();
    });
  });

  describe('getBoxesData', () => {
    beforeEach(() => {
      spyOn(DataService.prototype, 'loadData');
    });

    it('should get data of boxes from service', () => {
      service.getBoxesData(false);
      expect(DataService.prototype.loadData).toHaveBeenCalled();
    });

    it('should get data of boxes from service with refresh', () => {
      service.getBoxesData(true);
      expect(service.areDataLoaded).toEqual(false);
      expect(DataService.prototype.loadData).toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    describe('when data have not been fetched yet', () => {
      beforeEach(() => {
        spyOn(MockDevHTTPService.prototype, 'getAllBoxes');
      });

      it('should call getAllBoxes from HTTP service', () => {
        service.loadData();
        expect(MockDevHTTPService.prototype.getAllBoxes).toHaveBeenCalled();
      });
    });

    describe('when data have already been loaded', () => {
      beforeEach(() => {
        service.areDataLoaded = true;
        spyOn(DataService.prototype, 'notifyObservers');
      });

      it('should call notifyObservers', () => {
        service.loadData();
        expect(DataService.prototype.notifyObservers).toHaveBeenCalled();
      });
    });
  });

  describe('notifyObservers', () => {
    beforeEach(() => {
      service.status = new MockEventEmitter();
      spyOn(MockEventEmitter.prototype, 'emit');
    });

    it('should notifyObservers', () => {
      service.notifyObservers();
      expect(MockEventEmitter.prototype.emit).toHaveBeenCalled();
    });
  });
});
