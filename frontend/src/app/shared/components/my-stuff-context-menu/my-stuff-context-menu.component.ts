import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from '../../models/menuItem.model';
import {Subscription} from 'rxjs';
import {ContextMenuService} from '../context-menu/context-menu.service';
import {Router} from '@angular/router';
import {SKIP_LOCATION_CHANGE} from '../../../constants';

@Component({
  selector: 'app-my-stuff-context-menu',
  templateUrl: './my-stuff-context-menu.component.html',
  styleUrls: ['./my-stuff-context-menu.component.scss']
})
export class MyStuffContextMenuComponent implements OnInit, OnDestroy {
  topItems: MenuItem[] = [];
  bottomItems: MenuItem[] = [];
  topItemsSub: Subscription;
  bottomItemsSub: Subscription;
  loading = false;

  constructor(
    private contextMenuService: ContextMenuService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.topItemsSub = this.contextMenuService.topItems.subscribe(topItems => {
      this.topItems = topItems;
      this.cd.detectChanges();
    });

    this.bottomItemsSub = this.contextMenuService.bottomItems.subscribe(bottomItems => {
      this.bottomItems = bottomItems;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.topItemsSub.unsubscribe();
    this.bottomItemsSub.unsubscribe();
  }

  onSelect(menuItem: MenuItem): void {
    if (!menuItem.disabled) {
      this.router.navigate(['/home/dashboard',
          {outlets: {'side-nav': [menuItem.url]}}],
        {skipLocationChange: SKIP_LOCATION_CHANGE });
    }
  }

  onBack(): void {
    this.router.navigate(['/home/dashboard',
      {outlets: {'side-nav': ['home']}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
  }
}
