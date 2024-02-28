import {Component, Input, OnInit} from '@angular/core';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {BattleMonsterAction} from '../../../../shared/models/creatures/battle-monster-action';
import {Action} from '../../../../shared/models/action.enum';

@Component({
  selector: 'app-battle-monster-actions',
  templateUrl: './battle-monster-actions.component.html',
  styleUrls: ['./battle-monster-actions.component.scss']
})
export class BattleMonsterActionsComponent implements OnInit {
  @Input() battleMonster: BattleMonster;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  eventSub: Subscription;
  clickDisabled = false;
  viewingAction: BattleMonsterAction = null;
  viewingInfo = false;
  viewingLegendaryPoints = false;

  actions: BattleMonsterAction[] = [];
  legendaryActions: BattleMonsterAction[] = [];
  lairActions: BattleMonsterAction[] = [];

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === (EVENTS.MenuAction.ActionDetails + this.columnIndex)) {
        this.infoClick();
      } else if (event === (EVENTS.MenuAction.LegendaryPoints + this.columnIndex)) {
        this.legendaryPointsClick();
      }
    });

    this.initializeActions();
  }

  private initializeActions(): void {
    this.actions = [];
    this.legendaryActions = [];
    this.lairActions = [];

    this.battleMonster.actions.forEach((action: BattleMonsterAction) => {
      if (action.actionType === Action.LEGENDARY) {
        this.legendaryActions.push(action);
      } else if (action.actionType === Action.LAIR) {
        this.lairActions.push(action);
      } else {
        this.actions.push(action);
      }
    });
  }

  onActionClick(action: BattleMonsterAction): void {
    this.viewingAction = action;
    this.updateClickDisabled();
  }

  useAction(action: BattleMonsterAction): void {
    this.viewingAction = null;
    this.updateClickDisabled();
  }

  closeAction(): void {
    this.viewingAction = null;
    this.updateClickDisabled();
  }

  private infoClick(): void {
    this.viewingInfo = true;
    this.updateClickDisabled();
  }

  saveInfo(): void {
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  closeInfo(): void {
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  legendaryPointsClick(): void {
    this.viewingLegendaryPoints = true;
    this.updateClickDisabled();
  }

  saveLegendaryPoints(): void {
    this.viewingLegendaryPoints = false;
    this.updateClickDisabled();
  }

  closeLegendaryPoints(): void {
    this.viewingLegendaryPoints = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingAction != null || this.viewingInfo || this.viewingLegendaryPoints;
  }

}
