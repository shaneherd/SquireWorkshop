import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {DamageTypeService} from '../../../../core/services/attributes/damage-type.service';

@Component({
  selector: 'app-damage-type-list',
  templateUrl: './damage-type-list.component.html',
  styleUrls: ['./damage-type-list.component.scss']
})
export class DamageTypeListComponent {
  loading = true;

  constructor(
    public damageTypeService: DamageTypeService,
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
