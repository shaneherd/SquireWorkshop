import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from '../../models/menuItem.model';
import {Subscription} from 'rxjs';
import {ContextMenuService} from '../context-menu/context-menu.service';
import {Router} from '@angular/router';
import {SKIP_LOCATION_CHANGE} from '../../../constants';

@Component({
  selector: 'app-shared-with-me-context-menu',
  templateUrl: './shared-with-me-context-menu.component.html',
  styleUrls: ['./shared-with-me-context-menu.component.scss']
})
export class SharedWithMeContextMenuComponent implements OnInit, OnDestroy {
  loading = false;
  menuItems: MenuItem[];
  menuItemsSub: Subscription;

  constructor(
    private contextMenuService: ContextMenuService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.menuItemsSub = this.contextMenuService.bottomItems.subscribe(bottomItems => {
      this.menuItems = bottomItems;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.menuItemsSub.unsubscribe();
  }

  onSelect(menuItem: MenuItem): void {
    if (!menuItem.disabled) {
      this.router.navigate(['/home/dashboard',
          {
            outlets: {'side-nav': [menuItem.url]}
          }],
        {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': false, 'shared': true} });
    }
  }

  onBack(): void {
    this.router.navigate(['/home/dashboard',
      {outlets: {'side-nav': ['home']}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
  }

}
