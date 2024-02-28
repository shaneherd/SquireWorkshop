import {Component, HostBinding, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../core/services/events.service';
import {MatDrawer} from '@angular/material/sidenav';
import {ResolutionService} from '../core/services/resolution.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../core/services/notification.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NotificationDialogData} from '../core/components/notification-dialog/notification-dialog-data';
import {Notification} from '../shared/models/notification';
import {NotificationDialogComponent} from '../core/components/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'full-height-component';
  @ViewChild('drawer', {static: false})
  drawer: MatDrawer;

  @ViewChild('drawer2', {static: false})
  userMenuDrawer: MatDrawer;

  eventSub: Subscription;
  queryParamsSub: Subscription;
  resSub: Subscription;
  drawerSub: Subscription = null;
  isDesktop = true;
  isPublic = false;
  isShared = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private resolutionService: ResolutionService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ToggleMenu) {
        this.drawer.toggle();
      } else if (event === EVENTS.CloseMenu) {
        this.drawer.toggle(false);
      } else if (event === EVENTS.UserMenuClick) {
        this.userMenuDrawer.toggle();
      }
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
      });

    this.resSub = this.resolutionService.width.subscribe(width => {
      this.isDesktop = ResolutionService.isDesktop(width);
    });

    setTimeout(() => {
      if (this.drawer != null) {
        this.drawerSub = this.drawer.closedStart.subscribe(() => {
          this.resetNavigation();
        });
      }
    });

    this.initializeNotifications();
  }

  private initializeNotifications(): void {
    this.notificationService.getNotifications().then((notifications: Notification[]) => {
      if (notifications.length > 0) {
        const self = this;
        const data = new NotificationDialogData();
        data.notifications = notifications;
        data.confirm = () => {
          self.acknowledgeNotifications();
        };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        this.dialog.open(NotificationDialogComponent, dialogConfig);
      }
    });
  }

  private acknowledgeNotifications(): void {
    this.notificationService.acknowledgeNotifications();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.resSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
    if (this.drawerSub != null) {
      this.drawerSub.unsubscribe();
    }
  }

  private resetNavigation(): void {
    const pathname = window.location.pathname;

    const regExp = /middle-nav:(.+?)(?:\x2f\x2f|\x29)/g;
    const match = regExp.exec(pathname);

    const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
    if (match == null) {
      this.router.navigate(['/home/dashboard', {outlets: {
          'side-nav': ['default'],
        }}], extras);
    } else {
      const middleNave = match[1];
      const parts = middleNave.split('/');

      let path = parts.length > 0 ? parts[0] : '';
      const id = parts.length > 1 ? parts[1] : '';
      const childId = parts.length > 2 ? parts[2] : '';

      if (path.indexOf('Manage') === path.length - 6) {
        path = path.substring(0, path.length - 6);
      }

      if (childId !== '') {
        this.router.navigate(['/home/dashboard', {outlets: {
            'side-nav': [path, id, childId],
          }}], extras);
      } else if (id !== '') {
        this.router.navigate(['/home/dashboard', {outlets: {
            'side-nav': [path, id],
          }}], extras);
      } else {
        this.router.navigate(['/home/dashboard', {outlets: {
            'side-nav': [path],
          }}], extras);
      }
    }
  }
}
