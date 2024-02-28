import {Component, OnInit} from '@angular/core';
import {EventsService} from '../../core/services/events.service';
import {Router} from '@angular/router';
import {IdleService} from '../../core/services/idle.service';
import {EVENTS, LOCAL_STORAGE} from '../../constants';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router,
              private idleService: IdleService,
              private eventsService: EventsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.logout();
    this.eventsService.dispatchEvent(EVENTS.Logout);
  }

  logout(): void {
    localStorage.setItem(LOCAL_STORAGE.TOKEN, '');
    this.userService.clearUser();
    this.idleService.stopWatching();
    this.router.navigate(['/auth']);
  }
}
