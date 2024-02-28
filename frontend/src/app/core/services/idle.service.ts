import {Injectable} from '@angular/core';
import {TimeoutDialogComponent} from '../components/timeout-dialog/timeout-dialog.component';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {UserIdleService} from 'angular-user-idle';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LOCAL_STORAGE} from '../../constants';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  initialized = false;
  open = false;
  dialogRef: MatDialogRef<TimeoutDialogComponent, any> = null;
  data: any = {};
  timeoutLength = 120; // 2 minutes
  pingLength = 600000; // 10 minutes
  pingInterval: any = null;

  idleStart: Subscription;
  idleTimeout: Subscription;
  refreshSub: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userIdle: UserIdleService,
    private dialog: MatDialog) {
    this.data.userIdle = userIdle;
  }

  initialize(): void {
    if (!this.initialized) {
      this.idleStart = this.userIdle.onTimerStart().subscribe(count => {
        if (count < this.timeoutLength) {
          this.data.seconds = this.timeoutLength - count;
        }
        this.openDialog();
      });

      this.idleTimeout = this.userIdle.onTimeout().subscribe(() => {
        this.dialogRef.close();
        this.router.navigate(['/auth/logout']);
      });
    }

    if (this.pingInterval == null) {
      const self = this;
      this.pingInterval = setInterval(function () {
        self.refresh()
      }, this.pingLength);
    }

    this.refresh();
    this.initialized = true;
  }

  refresh(): void {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    this.refreshSub = this.http.post<any>(environment.backendUrl + '/authentication/refresh', options)
      .subscribe(
        res => {
          localStorage.setItem(LOCAL_STORAGE.TOKEN, res.token);
        }, () => {
          this.router.navigate(['/auth/logout']);
        });
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();

    if (this.idleStart != null) {
      this.idleStart.unsubscribe();
    }
    if (this.idleTimeout != null) {
      this.idleTimeout.unsubscribe();
    }
    if (this.refreshSub != null) {
      this.refreshSub.unsubscribe();
    }

    if (this.dialogRef != null) {
      this.dialogRef.close();
    }
    if (this.pingInterval != null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  startWatching() {
    this.initialize();
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  openDialog(): void {
    if (!this.open) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = this.data;
      dialogConfig.disableClose = true;
      this.dialogRef = this.dialog.open(TimeoutDialogComponent, dialogConfig);
      this.dialogRef.afterClosed().subscribe(() => {
        this.open = false;
      });
      this.open = true;
    }
  }
}
