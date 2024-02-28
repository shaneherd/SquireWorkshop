import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {DeityService} from '../../../../core/services/attributes/deity.service';

@Component({
  selector: 'app-deity-list',
  templateUrl: './deity-list.component.html',
  styleUrls: ['./deity-list.component.scss']
})
export class DeityListComponent {
  loading = true;

  constructor(
    public deityService: DeityService,
    private router: Router,
  ) { }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard'], {skipLocationChange: SKIP_LOCATION_CHANGE });
    }, NAVIGATION_DELAY);
    this.closeMiddle();
  }

  closeMiddle(): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
  }

}
