import {
  Injectable,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DevHTTPService } from './dev-http.service';
import { HTTPService } from './http.service';
import {
  CURRENT_ENVIRONMENT,
  ENVIRONMENT_DEVELOPMENT,
  ENVIRONMENT_PRODUCTION
} from '../config/app.config';
import { RESPONSE_CODES } from '../config/return-codes.config';

@Injectable()
export class DataService {
  public status = new EventEmitter();
  private data: any;
  private areDataLoaded: boolean = false;
  private dataService: any;

  constructor(
    private httpService: HTTPService,
    private devHttpService: DevHTTPService
  ) {
    this.setService();
    this.subscribeHTTPService();
  }

  getData() {
    return this.data;
  }

  getDataService() {
    return this.dataService;
  }

  setService() {
    switch (CURRENT_ENVIRONMENT) {
      case ENVIRONMENT_DEVELOPMENT:
        this.dataService = this.devHttpService;
        break;
      case ENVIRONMENT_PRODUCTION:
        this.dataService = this.httpService;
        break;
    }
  }

  subscribeHTTPService() {
    this.dataService.fetched.subscribe(code => {
      this.treatFetchedData(code);
    });
  }

  treatFetchedData(code: number) {
    if (code === RESPONSE_CODES.OK) {
      this.data = this.dataService.data;
      this.notifyObservers(RESPONSE_CODES.READY);
    }
  }

  getBoxesData(doRefresh: boolean) {
    if (doRefresh) this.areDataLoaded = false;
    this.loadData();
  }

  loadData() {
    if (!this.areDataLoaded)
      this.dataService.getAllBoxes();
    else
      this.notifyObservers(RESPONSE_CODES.READY);
  }

  notifyObservers(status: number) {
    this.status.emit(status);
  }
}
