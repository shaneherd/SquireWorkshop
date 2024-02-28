import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SKIP_LOCATION_CHANGE} from '../../../constants';
import {Router} from '@angular/router';
import {MenuItem} from '../../models/menuItem.model';
import {Subscription} from 'rxjs';
import {ContextMenuService} from '../context-menu/context-menu.service';

@Component({
  selector: 'app-public-context-menu',
  templateUrl: './public-context-menu.component.html',
  styleUrls: ['./public-context-menu.component.scss']
})
export class PublicContextMenuComponent implements OnInit, OnDestroy {
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
        {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': true, 'shared': false} });
    }
  }

  onBack(): void {
    this.router.navigate(['/home/dashboard',
      {outlets: {'side-nav': ['home']}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
  }

}
