import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {DeityCategoryService} from '../../../../core/services/attributes/deity-category.service';

@Component({
  selector: 'app-deity-category-list',
  templateUrl: './deity-category-list.component.html',
  styleUrls: ['./deity-category-list.component.scss']
})
export class DeityCategoryListComponent {
  loading = true;

  constructor(
    public deityCategoryService: DeityCategoryService,
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
