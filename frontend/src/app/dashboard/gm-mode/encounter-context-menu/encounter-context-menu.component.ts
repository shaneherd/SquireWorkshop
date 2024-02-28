import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {EncounterContextMenuService} from './encounter-context-menu.service';
import {Router} from '@angular/router';
import {EventsService} from '../../../core/services/events.service';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../../../constants';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-encounter-context-menu',
  templateUrl: './encounter-context-menu.component.html',
  styleUrls: ['./encounter-context-menu.component.scss']
})
export class EncounterContextMenuComponent implements OnInit, OnDestroy {
  id: string;
  bottomItems: MenuItem[] = [];
  bottomItemsSub: Subscription;
  encounterSub: Subscription;

  constructor(
    private encounterContextMenuService: EncounterContextMenuService,
    private router: Router,
    private eventsService: EventsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.encounterSub = this.encounterContextMenuService.encounterId.subscribe((id: string) => {
      this.id = id;
    });

    this.bottomItemsSub = this.encounterContextMenuService.bottomItems.subscribe(bottomItems => {
      this.bottomItems = bottomItems;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.bottomItemsSub.unsubscribe();
    this.encounterSub.unsubscribe();
  }

  onSelect(menuItem: MenuItem): void {
    if (!menuItem.disabled) {
      if (menuItem.id === this.encounterContextMenuService.QUICK_REFERENCES) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.QuickReferences);
      } else if (menuItem.id === this.encounterContextMenuService.ROLL_LOG) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.RollLog);
      } else if (menuItem.id === this.encounterContextMenuService.ADD_CREATURES) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.AddCreatures);
      } else if (menuItem.id === this.encounterContextMenuService.REORDER_INITIATIVE) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.ReorderInitiative);
      } else if (menuItem.id === this.encounterContextMenuService.RESTART_ENCOUNTER) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.RestartEncounter);
      } else if (menuItem.id === this.encounterContextMenuService.FINISH_ENCOUNTER) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.FinishEncounter);
      } else if (menuItem.id === this.encounterContextMenuService.NOTIFICATIONS) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.Notifications);
      } else if (menuItem.id === this.encounterContextMenuService.ATTACK) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.Attack);
      } else if (menuItem.id === this.encounterContextMenuService.PAUSE_ENCOUNTER) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.PauseEncounter);
      } else if (menuItem.id === this.encounterContextMenuService.INITIATIVE) {
        this.eventsService.dispatchEvent(EVENTS.Encounter.ToggleInitiative);
      }
      this.eventsService.dispatchEvent(EVENTS.CloseMenu);
    }
  }

  onBack(): void {
    this.router.navigate(['/home/dashboard',
      {outlets: {'side-nav': ['campaigns']}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
  }

}
