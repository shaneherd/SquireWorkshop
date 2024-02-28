import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EventsService} from '../../../core/services/events.service';
import {EVENTS, FEATURE_FLAG_ID, SKIP_LOCATION_CHANGE} from '../../../constants';
import {FeatureFlagService} from '../../../core/services/feature-flag.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
  constructor(
    private router: Router,
    private eventsService: EventsService
  ) {
  }

  click(route: string, newWindow = false, isDashboard = true, sideNav = false): void {
    this.eventsService.dispatchEvent(EVENTS.UserMenuClick);
    if (newWindow) {
      const url = this.router.createUrlTree([route])
      window.open(url.toString(), '_blank')
    } else if (isDashboard) {
      if (sideNav) {
        this.router.navigate(['/home/dashboard',
            {outlets: {'middle-nav': [route], 'side-nav': [route]}}],
          {skipLocationChange: SKIP_LOCATION_CHANGE});
      } else {
        this.router.navigate(['/home/dashboard', {outlets: {
            'middle-nav': [route]
          }}], {skipLocationChange: SKIP_LOCATION_CHANGE });
      }
    } else {
      this.router.navigate([route], {skipLocationChange: SKIP_LOCATION_CHANGE });
    }
  }
}
