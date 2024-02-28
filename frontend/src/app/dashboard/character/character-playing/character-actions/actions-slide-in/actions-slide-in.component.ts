import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActionType, EVENTS} from '../../../../../constants';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureFeature} from '../../../../../shared/models/creatures/creature-feature';
import {CreatureSpell} from '../../../../../shared/models/creatures/creature-spell';
import {CreatureSpellConfiguration} from '../../../../../shared/models/creatures/creature-spell-configuration';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {ItemType} from '../../../../../shared/models/items/item-type.enum';
import {EquipmentSlotType} from '../../../../../shared/models/items/equipment-slot-type.enum';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {PowerModifier} from '../../../../../shared/models/powers/power-modifier';
import {ChosenClass} from '../../../../../shared/models/creatures/characters/chosen-class';
import {CreatureAbilityProficiency} from '../../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {Spellcasting} from '../../../../../shared/models/spellcasting';
import {AttackType} from '../../../../../shared/models/attack-type.enum';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../../../core/services/creatures/character.service';
import {CastingTimeUnit} from '../../../../../shared/models/casting-time-unit.enum';
import {Action} from '../../../../../shared/models/action.enum';
import {CreatureAction} from '../../../../../shared/models/creatures/creature-action';
import {CreatureActionType} from '../../../../../shared/models/creatures/creature-action-type.enum';
import {CreatureActions} from '../../../../../shared/models/creatures/creature-actions';
import {EventsService} from '../../../../../core/services/events.service';
import {Subscription} from 'rxjs';

export class CreatureActionSelection {
  creatureAction: CreatureAction;
  selected = false;
}

@Component({
  selector: 'app-actions-slide-in',
  templateUrl: './actions-slide-in.component.html',
  styleUrls: ['./actions-slide-in.component.scss']
})
export class ActionsSlideInComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() actionType: ActionType;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  loading = false;
  weaponActions: CreatureActionSelection[] = [];
  spellActions: CreatureActionSelection[] = [];
  featureActions: CreatureActionSelection[] = [];
  clickDisabled = false;

  viewingAction: CreatureActionSelection = null;
  viewingItem: CreatureActionSelection = null;
  viewingSpell: CreatureActionSelection = null;
  viewingFeature: CreatureActionSelection = null;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeActions();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateActionsList) {
        this.initializeActions();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeActions(): void {
    this.loading = true;
    this.weaponActions = [];
    this.spellActions = [];
    this.featureActions = [];

    this.creatureService.getCreatureActions(this.playerCharacter, this.actionType).then((actions: CreatureAction[]) => {
      actions.forEach((creatureAction: CreatureAction) => {
        const creatureActionSelection = new CreatureActionSelection();
        creatureActionSelection.creatureAction = creatureAction;
        creatureActionSelection.selected = creatureAction.favorite;
        switch (creatureAction.creatureActionType) {
          case CreatureActionType.SPELL:
            this.spellActions.push(creatureActionSelection);
            break;
          case CreatureActionType.FEATURE:
            this.featureActions.push(creatureActionSelection);
            break;
          case CreatureActionType.ITEM:
            this.weaponActions.push(creatureActionSelection);
            break;
        }
      });
      this.loading = false;
    });
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    const newFavoriteActions: CreatureAction[] = this.getUpdatedFavoriteActions();
    const creatureActions = new CreatureActions();
    creatureActions.creatureActions = newFavoriteActions;
    this.creatureService.updateCreatureFavoriteActions(this.playerCharacter, creatureActions).then(() => {
      this.save.emit();
    });
  }

  private getUpdatedFavoriteActions(): CreatureAction[] {
    const favoriteActions: CreatureAction[] = [];
    for (let i = 0; i < this.playerCharacter.favoriteActions.length; i++) {
      const action = this.playerCharacter.favoriteActions[i];
      let creatureActionSelection = this.getCreatureAction(action.id, this.weaponActions);
      if (creatureActionSelection == null) {
        creatureActionSelection = this.getCreatureAction(action.id, this.spellActions);
      }
      if (creatureActionSelection == null) {
        creatureActionSelection = this.getCreatureAction(action.id, this.featureActions);
      }
      if (creatureActionSelection == null || creatureActionSelection.selected) {
        favoriteActions.push(action);
      }
    }

    this.addFavoriteCreatureActions(favoriteActions, this.weaponActions);
    this.addFavoriteCreatureActions(favoriteActions, this.spellActions);
    this.addFavoriteCreatureActions(favoriteActions, this.featureActions);
    this.updateFavoriteOrders(favoriteActions);

    return favoriteActions;
  }

  private getCreatureAction(id: string, actions: CreatureActionSelection[]): CreatureActionSelection {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.creatureAction.id === id) {
        return action;
      }
    }
    return null;
  }

  private addFavoriteCreatureActions(favoriteActions: CreatureAction[], selections: CreatureActionSelection[]): void {
    selections.forEach((selection: CreatureActionSelection) => {
      if (selection.selected && !this.selectionInList(selection, favoriteActions)) {
        favoriteActions.push(selection.creatureAction);
      }
    });
  }

  private selectionInList(selection: CreatureActionSelection, actions: CreatureAction[]): boolean {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.id === selection.creatureAction.id) {
        return true;
      }
    }
    return false;
  }

  private updateFavoriteOrders(actions: CreatureAction[]): void {
    actions.forEach((action: CreatureAction, index: number) => {
      action.favoriteOrder = index + 1;
    });
  }

  cardClick(creatureActionSelection: CreatureActionSelection): void {
    this.viewingAction = creatureActionSelection;
    this.updateClickDisabled();
    // switch (creatureActionSelection.creatureAction.creatureActionType) {
    //   case CreatureActionType.SPELL:
    //     this.onSpellClick(creatureActionSelection);
    //     break;
    //   case CreatureActionType.FEATURE:
    //     this.onFeatureClick(creatureActionSelection);
    //     break;
    //   case CreatureActionType.ITEM:
    //     this.onItemClick(creatureActionSelection);
    //     break;
    // }
  }

  continueAction(): void {
    this.viewingAction = null;
    this.updateClickDisabled();
  }

  cancelAction(): void {
    this.viewingAction = null;
    this.updateClickDisabled();
  }

  onItemClick(creatureActionSelection: CreatureActionSelection): void {
    this.viewingItem = creatureActionSelection;
    this.updateClickDisabled();
  }

  continueItem(): void {
    this.viewingItem = null;
    this.updateClickDisabled();
  }

  closeItem(): void {
    this.viewingItem = null;
    this.updateClickDisabled();
  }

  toggleFavorite(creatureActionSelection: CreatureActionSelection): void {
    creatureActionSelection.selected = !creatureActionSelection.selected;
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingAction != null || this.viewingItem != null || this.viewingSpell != null || this.viewingFeature != null;
  }

}
