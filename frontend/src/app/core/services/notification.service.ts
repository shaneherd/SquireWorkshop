import {Injectable, OnDestroy} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Notification} from '../../shared/models/notification';
import {environment} from '../../../environments/environment';
import {EVENTS, LOCAL_STORAGE} from '../../constants';
import {EventsService} from './events.service';
import {Subscription} from 'rxjs';
import {UserModel} from '../../shared/models/user.model';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  messageDuration = 5000;
  loggedIn = false;
  eventSub: Subscription;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private userService: UserService,
    private eventsService: EventsService) {
    const user = localStorage.getItem(LOCAL_STORAGE.USER);
    this.loggedIn = user != null;

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Login) {
        this.loggedIn = true;
      } else if (event === EVENTS.Logout) {
        this.loggedIn = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.eventSub.unsubscribe();
  }

  displayMessage(message: string, clz: string, duration: number, forceDisplay = false): void {
    if (this.loggedIn || forceDisplay) {
      this.snackBar.open(
        message,
        this.translate.instant('Dismiss'),
        {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: duration,
          panelClass: clz
        }
      );
    }
  }

  info(message: string, forceDisplay = false): void {
    this.displayMessage(message, 'info', this.messageDuration, forceDisplay);
  }

  success(message: string, forceDisplay = false): void {
    this.displayMessage(message, 'success', this.messageDuration, forceDisplay);
  }

  warn(message: any, forceDisplay = false): void {
    this.displayMessage(message, 'warn', this.messageDuration, forceDisplay);
  }

  error(message: any, forceDisplay = false): void {
    if (typeof message !== 'string') {
      message = this.translate.instant('Error.Unknown');
    }
    this.displayMessage(message, 'error', this.messageDuration, forceDisplay);
  }

  getNotifications(): Promise<Notification[]> {
    return this.http.get<Notification[]>(`${environment.backendUrl}/user/notifications`).toPromise();
  }

  acknowledgeNotifications(): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/user/notifications`, {}).toPromise();
  }
}
