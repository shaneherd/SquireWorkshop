import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from '../../models/menuItem.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ContextMenuService} from './context-menu.service';
import {SKIP_LOCATION_CHANGE} from '../../../constants';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  menuItemsSub: Subscription;

  constructor(
    private contextMenuService: ContextMenuService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.menuItemsSub = this.contextMenuService.homeItems.subscribe(topItems => {
      this.menuItems = topItems;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.menuItemsSub.unsubscribe();
  }

  onSelect(menuItem: MenuItem): void {
    if (!menuItem.disabled) {
      this.router.navigate(['/home/dashboard',
          {outlets: {'side-nav': [menuItem.url]}}],
        {skipLocationChange: SKIP_LOCATION_CHANGE });
    }
  }
}
