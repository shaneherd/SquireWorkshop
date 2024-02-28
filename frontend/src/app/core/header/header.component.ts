import {Component, OnDestroy, OnInit} from '@angular/core';
import {IdleService} from '../services/idle.service';
import {EventsService} from '../services/events.service';
import {Subscription} from 'rxjs';
import {CharacterContextMenuService} from '../../shared/components/character-context-menu/character-context-menu.service';
import {EVENTS, LOCAL_STORAGE} from '../../constants';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedIn = false;
  showMenu = true;
  isCharacter = false;
  eventSub: Subscription;
  characterSub: Subscription;
  routeSub: Subscription;
  env = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private idleService: IdleService,
    private eventsService: EventsService,
    private characterContextMenuService: CharacterContextMenuService
  ) {
  }

  ngOnInit() {
    this.env = environment.environmentName;
    this.characterSub = this.characterContextMenuService.display.subscribe((display: boolean) => {
      this.isCharacter = display;
    });

    this.routeSub = this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.updateShowMenu();
      }
    });

    this.loggedIn = this.isLoggedId();
    this.updateShowMenu();

    if (this.loggedIn) {
      this.idleService.startWatching();
    } else {
      this.idleService.stopWatching();
    }
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Login) {
        this.loggedIn = true;
        this.updateShowMenu();
      } else if (event === EVENTS.Logout) {
        this.loggedIn = false;
        this.updateShowMenu();
      }
    });
  }

  private updateShowMenu(): void {
    this.showMenu = this.loggedIn && window.location.pathname.indexOf('/home/dashboard') > -1;
  }

  headerClick(): void {
    this.eventsService.dispatchEvent(EVENTS.CloseMenu);
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.characterSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  isLoggedId(): boolean {
    const token: String = localStorage.getItem(LOCAL_STORAGE.TOKEN);
    return token != null && token !== '';
  }

  toggleContextMenu(): void {
    this.eventsService.dispatchEvent(EVENTS.ToggleMenu);
  }

  toggleMenu(): void {
    this.eventsService.dispatchEvent(EVENTS.UserMenuClick);
  }
}
