import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  public REFRESH_ROLL_LOG = 'REFRESH_ROLL_LOG';

  protected _eventSubject = new Subject();
  public events = this._eventSubject.asObservable();

  constructor() {
  }

  dispatchEvent(event) {
    this._eventSubject.next(event);
  }
}
