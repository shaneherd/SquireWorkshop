import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureAction} from '../../../../shared/models/creatures/creature-action';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-character-actions',
  templateUrl: './character-actions.component.html',
  styleUrls: ['./character-actions.component.scss']
})
export class CharacterActionsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  eventSub: Subscription;
  viewingStandard = false;
  viewingBonus = false;
  viewingReactions = false;
  viewingFavorites = false;
  viewingSettings = false;
  viewingAction: CreatureAction;
  clickDisabled = false;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FetchItemsList
        || event === EVENTS.FetchSpellList
        || event === EVENTS.FetchFeaturesList) {
        this.fetchActions();
      } else if (event === (EVENTS.MenuAction.StandardActions + this.columnIndex)) {
        this.standardActionsClick();
      } else if (event === (EVENTS.MenuAction.BonusActions + this.columnIndex)) {
        this.bonusActionsClick();
      } else if (event === (EVENTS.MenuAction.Reactions + this.columnIndex)) {
        this.reactionsClick();
      } else if (event === (EVENTS.MenuAction.FavoriteActions + this.columnIndex)) {
        this.favoriteActionsClick();
      } else if (event === (EVENTS.MenuAction.ActionSettings + this.columnIndex)) {
        this.settingsClick();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private fetchActions(): void {
    this.creatureService.getCreatureFavoriteActions(this.playerCharacter).then((creatureActions: CreatureAction[]) => {
      this.playerCharacter.favoriteActions = creatureActions;
      this.eventsService.dispatchEvent(EVENTS.UpdateActionsList)
    });
  }

  private standardActionsClick(): void {
    this.viewingStandard = true;
    this.updateClickDisabled();
  }

  standardContinue(): void {
    this.viewingStandard = false;
    this.fetchActions();
    this.updateClickDisabled();
  }

  standardClose(): void {
    this.viewingStandard = false;
    this.updateClickDisabled();
  }

  private bonusActionsClick(): void {
    this.viewingBonus = true;
    this.updateClickDisabled();
  }

  bonusContinue(): void {
    this.viewingBonus = false;
    this.fetchActions();
    this.updateClickDisabled();
  }

  bonusClose(): void {
    this.viewingBonus = false;
    this.updateClickDisabled();
  }

  private reactionsClick(): void {
    this.viewingReactions = true;
    this.updateClickDisabled();
  }

  reactionsContinue(): void {
    this.viewingReactions = false;
    this.fetchActions();
    this.updateClickDisabled();
  }

  reactionsClose(): void {
    this.viewingReactions = false;
    this.updateClickDisabled();
  }

  private favoriteActionsClick(): void {
    this.viewingFavorites = true;
    this.updateClickDisabled();
  }

  favoritesContinue(): void {
    this.viewingFavorites = false;
    this.updateClickDisabled();
    this.fetchActions();
  }

  favoritesClose(): void {
    this.viewingFavorites = false;
    this.updateClickDisabled();
  }

  favoriteCardClick(action: CreatureAction): void {
    if (!this.clickDisabled) {
      this.viewingAction = action;
      this.updateClickDisabled();
    }
  }

  continueAction(): void {
    this.viewingAction = null;
    this.updateClickDisabled();
  }

  cancelAction(): void {
    this.viewingAction = null;
    this.updateClickDisabled();
  }

  private settingsClick(): void {
    this.viewingSettings = true;
    this.updateClickDisabled();
  }

  saveSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  closeSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingAction != null || this.viewingStandard || this.viewingBonus || this.viewingReactions || this.viewingFavorites || this.viewingSettings;
  }

}
