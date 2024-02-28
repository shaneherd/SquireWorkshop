import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {CreatureActions} from '../../../../../shared/models/creatures/creature-actions';
import {CreatureAction} from '../../../../../shared/models/creatures/creature-action';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CreatureActionSelection} from '../actions-slide-in/actions-slide-in.component';
import {EVENTS} from '../../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../../core/services/events.service';

@Component({
  selector: 'app-favorite-actions-slide-in',
  templateUrl: './favorite-actions-slide-in.component.html',
  styleUrls: ['./favorite-actions-slide-in.component.scss']
})
export class FavoriteActionsSlideInComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  eventSub: Subscription;
  clickDisabled = false;
  favoriteActions: CreatureActionSelection[] = [];

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeFavoriteActions();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateActionsList) {
        this.initializeFavoriteActions();
      }
    });
  }

  private initializeFavoriteActions(): void {
    const favoriteActions: CreatureActionSelection[] = [];
    this.playerCharacter.favoriteActions.forEach((action: CreatureAction) => {
      const selection = new CreatureActionSelection();
      selection.creatureAction = action;
      selection.selected = true;
      favoriteActions.push(selection);
    });
    this.favoriteActions = favoriteActions;
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  onSave(): void {
    const creatureActions = new CreatureActions();
    creatureActions.creatureActions = this.getUpdatedCreatureActions();
    this.creatureService.updateCreatureFavoriteActions(this.playerCharacter, creatureActions).then(() => {
      this.save.emit();
    });
  }

  private getUpdatedCreatureActions(): CreatureAction[] {
    const actions: CreatureAction[] = [];
    for (let i = 0; i < this.favoriteActions.length; i++) {
      const action = this.favoriteActions[i];
      if (action.selected) {
        action.creatureAction.favoriteOrder = i + 1;
        actions.push(action.creatureAction);
      } else {
        this.favoriteActions.splice(i, 1);
        i--;
      }
    }
    return actions;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.favoriteActions, event.previousIndex, event.currentIndex);
  }

  toggleFavorite(creatureActionSelection: CreatureActionSelection): void {
    creatureActionSelection.selected = !creatureActionSelection.selected;
  }

}
