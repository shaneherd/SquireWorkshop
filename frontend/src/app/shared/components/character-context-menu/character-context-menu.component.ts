import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CharacterContextMenuService} from './character-context-menu.service';
import {MenuItem} from '../../models/menuItem.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../core/services/events.service';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../../../constants';

@Component({
  selector: 'app-character-context-menu',
  templateUrl: './character-context-menu.component.html',
  styleUrls: ['./character-context-menu.component.scss']
})
export class CharacterContextMenuComponent implements OnInit, OnDestroy {
  id: string;
  bottomItems: MenuItem[] = [];
  bottomItemsSub: Subscription;
  characterSub: Subscription;

  constructor(
    private characterContextMenuService: CharacterContextMenuService,
    private router: Router,
    private eventsService: EventsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.characterSub = this.characterContextMenuService.characterId.subscribe((id: string) => {
      this.id = id;
    });

    this.bottomItemsSub = this.characterContextMenuService.bottomItems.subscribe(bottomItems => {
      this.bottomItems = bottomItems;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.bottomItemsSub.unsubscribe();
    this.characterSub.unsubscribe();
  }

  onSelect(menuItem: MenuItem): void {
    if (!menuItem.disabled) {
      if (menuItem.id === this.characterContextMenuService.EDIT) {
        this.eventsService.dispatchEvent(EVENTS.EditCharacter);
      } else if (menuItem.id === this.characterContextMenuService.PAGE_ORDER) {
        this.eventsService.dispatchEvent(EVENTS.EditPageOrder);
      } else if (menuItem.id === this.characterContextMenuService.ROLL_LOG) {
        this.eventsService.dispatchEvent(EVENTS.CharacterRollLog);
      } else if (menuItem.id === this.characterContextMenuService.CHARACTER_SETTINGS) {
        this.eventsService.dispatchEvent(EVENTS.CharacterSettings);
      } else if (menuItem.id === this.characterContextMenuService.VALIDATE_CHARACTER) {
        this.eventsService.dispatchEvent(EVENTS.ValidateCharacter);
      } else if (menuItem.id === this.characterContextMenuService.JOIN_CAMPAIGN) {
        this.eventsService.dispatchEvent(EVENTS.JoinCampaign);
      } else if (menuItem.id === this.characterContextMenuService.LEAVE_CAMPAIGN) {
        this.eventsService.dispatchEvent(EVENTS.LeaveCampaign);
      } else if (menuItem.id === this.characterContextMenuService.PRINT_CHARACTER) {
        this.eventsService.dispatchEvent(EVENTS.PrintCharacter);
      } else if (menuItem.id === this.characterContextMenuService.QUICK_REFERENCES) {
        this.eventsService.dispatchEvent(EVENTS.QuickReferences);
      } else if (menuItem.id === this.characterContextMenuService.EXPORT_CHARACTER) {
        this.eventsService.dispatchEvent(EVENTS.ExportCharacter);
      }
      this.eventsService.dispatchEvent(EVENTS.CloseMenu);
    }
  }

  onBack(): void {
    this.router.navigate(['/home/dashboard',
      {outlets: {'side-nav': ['characters']}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
  }

}
